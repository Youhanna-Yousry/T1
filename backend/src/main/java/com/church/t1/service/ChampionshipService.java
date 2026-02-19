package com.church.t1.service;

import com.church.t1.dto.response.StudentProfile;
import com.church.t1.dto.response.StudentsLeaderboard;
import com.church.t1.mapper.AppMapper;
import com.church.t1.model.entity.Competition;
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
}
