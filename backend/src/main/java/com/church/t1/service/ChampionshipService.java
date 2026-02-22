package com.church.t1.service;

import com.church.t1.dto.response.StudentProfile;
import com.church.t1.dto.response.StudentsLeaderboard;
import com.church.t1.mapper.AppMapper;
import com.church.t1.model.entity.Competition;
import com.church.t1.model.entity.Week;
import com.church.t1.repository.StudentLogRepository;
import com.church.t1.repository.WeeklyResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChampionshipService {

    private final CompetitionContextService competitionContextService;
    private final WeeklyResultRepository weeklyResultRepository;
    private final StudentLogRepository studentLogRepository;
    private final AppMapper appMapper;

    @Transactional(readOnly = true)
    public StudentsLeaderboard getChampionshipLeaderboard(Long competitionId) {
        Competition competition = competitionContextService.resolveCompetition(competitionId);
        List<StudentProfile> standings = weeklyResultRepository.findChampionshipLeaderboard(competition.getId());

       return StudentsLeaderboard.builder()
               .competitionSummary(appMapper.toCompetitionSummary(competition))
               .standings(standings)
               .build();
    }

    @Transactional(readOnly = true)
    public StudentsLeaderboard getWeeklyLeaderboard(Long competitionId, Long weekId) {
        CompetitionContextService.Context context = competitionContextService.resolveContext(competitionId, weekId);
        Competition competition = context.competition();
        Week week = context.week();

        List<StudentProfile> standings = studentLogRepository.findWeeklyLeaderboard(competition.getId(), week.getId());

        return StudentsLeaderboard.builder()
                .competitionSummary(appMapper.toCompetitionSummary(competition))
                .standings(standings)
                .build();
    }
}
