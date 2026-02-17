package com.church.t1.scheduler;

import com.church.t1.model.entity.User;
import com.church.t1.model.entity.Week;
import com.church.t1.model.entity.WeeklyResult;
import com.church.t1.repository.StudentLogRepository;
import com.church.t1.repository.WeekRepository;
import com.church.t1.repository.WeeklyResultRepository;
import com.church.t1.repository.projection.WeeklyRawScore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class StudentsRankComputerTask {

    private final WeekRepository weekRepository;

    private final StudentLogRepository studentLogRepository;

    private final WeeklyResultRepository weeklyResultRepository;

    @Value("${app.ranking.base-points:40}")
    private int basePoints;

    @Value("${app.ranking.step-points:2}")
    private int stepPoints;

    @Scheduled(cron = "${app.ranking.cron}")
    @Transactional
    public void calculateWeeklyRankings() {
        log.info("Starting Weekly Ranking Job...");
        weekRepository.findFirstByEndDateBeforeOrderByEndDateDesc(Instant.now()).ifPresentOrElse(
                this::processWeek,
                () -> log.warn("No closed week found. Skipping.")
        );
    }

    private void processWeek(Week week) {
        log.info("Processing week: {}", week.getName());
        List<WeeklyRawScore> rawScores = studentLogRepository.findWeeklyRawScores(week.getId());

        if (rawScores.isEmpty()) {
            return;
        }

        Map<Long, WeeklyResult> existingResults = fetchExistingResults(week.getId());
        RankingContext context = new RankingContext(week, basePoints, stepPoints);

        List<WeeklyResult> resultsToSave = new ArrayList<>();

        for (WeeklyRawScore score : rawScores) {
            int rawScore = getSafeScore(score);

            if (context.shouldStop(rawScore)) {
                break;
            }

            context.updateRank(rawScore);

            resultsToSave.add(createWeeklyResult(score.getUser(), rawScore, context, existingResults));
        }

        if (!resultsToSave.isEmpty()) {
            weeklyResultRepository.saveAll(resultsToSave);
            log.info("Saved {} results for week {}.", resultsToSave.size(), week.getName());
        }
    }

    private Map<Long, WeeklyResult> fetchExistingResults(Long weekId) {
        return weeklyResultRepository.findByWeekId(weekId)
                .stream()
                .collect(Collectors.toMap(r -> r.getUser().getId(), Function.identity()));
    }

    private int getSafeScore(WeeklyRawScore score) {
        return score.getTotalScore() != null ? score.getTotalScore().intValue() : 0;
    }

    private WeeklyResult createWeeklyResult(User user, int rawScore, RankingContext ctx, Map<Long, WeeklyResult> existingMap) {
        WeeklyResult result = existingMap.getOrDefault(user.getId(), new WeeklyResult());

        if (result.getId() == null) {
            result.setWeek(ctx.week);
            result.setUser(user);
            result.setCompetition(ctx.week.getCompetition());
        }

        result.setRawAttendanceScore(rawScore);
        result.setRankInWeek(ctx.currentRank);
        result.setChampionshipPoints(ctx.getCurrentPoints());

        return result;
    }

    private static class RankingContext {
        final Week week;
        final int stepPoints;

        int currentPoints;
        int currentRank = 1;
        long previousRawScore = -1;

        RankingContext(Week week, int basePoints, int stepPoints) {
            this.week = week;
            this.currentPoints = basePoints;
            this.stepPoints = stepPoints;
        }

        boolean shouldStop(int rawScore) {
            if (rawScore <= 0) return true;
            return getCurrentPoints() <= 0;
        }

        void updateRank(int rawScore) {
            if (previousRawScore != -1 && rawScore < previousRawScore) {
                currentRank++;
                currentPoints -= stepPoints;
            }
            previousRawScore = rawScore;
        }

        int getCurrentPoints() {
            return currentPoints;
        }
    }
}