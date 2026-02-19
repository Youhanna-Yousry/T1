package com.church.t1.service;

import com.church.t1.dto.response.StudentProfile;
import com.church.t1.dto.response.StudentsLeaderboard;
import com.church.t1.mapper.AppMapper;
import com.church.t1.model.entity.Competition;
import com.church.t1.model.entity.Week;
import com.church.t1.repository.WeekRepository;
import com.church.t1.repository.WeeklyResultRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChampionshipService {

    private final CompetitionContextService competitionContextService;
    private final WeeklyResultRepository weeklyResultRepository;
    private final WeekRepository weekRepository;
    private final AppMapper  appMapper;

    @Transactional(readOnly = true)
    public StudentsLeaderboard getStudentsStandings(Long competitionId) {
        Competition competition = competitionContextService.resolveCompetition(competitionId);
        List<StudentProfile> standings = weeklyResultRepository.findChampionshipDriversStandings(competition.getId());

       return StudentsLeaderboard.builder()
               .competitionSummary(appMapper.toCompetitionSummary(competition))
               .standings(standings)
               .build();
    }

    @Transactional(readOnly = true)
    public StudentsLeaderboard getWeeklyStandings(Long competitionId, Long weekId) {
        Competition competition = competitionContextService.resolveCompetition(competitionId);

        Week week;
        if (weekId != null) {
            week = weekRepository.findById(weekId)
                    .orElseThrow(() -> new EntityNotFoundException("Week not found: " + weekId));
        } else {
            Instant now = Instant.now();
            week = weekRepository.findCurrentWeek(competition.getId(), now)
                    .or(() -> weekRepository.findFirstByCompetitionIdAndEndDateBeforeOrderByEndDateDesc(competition.getId(), now))
                    .orElseThrow(() -> new RuntimeException("No week available for competition: " + competition.getName()));
        }

        List<StudentProfile> standings = weeklyResultRepository.findWeeklyStandings(competition.getId(), week.getId());

        return StudentsLeaderboard.builder()
                .competitionSummary(appMapper.toCompetitionSummary(competition))
                .standings(standings)
                .build();
    }
}
