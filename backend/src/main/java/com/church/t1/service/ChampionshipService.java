package com.church.t1.service;

import com.church.t1.dto.response.ChampionshipStanding;
import com.church.t1.model.entity.Competition;
import com.church.t1.repository.CompetitionRepository;
import com.church.t1.repository.WeeklyResultRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChampionshipService {

    private final WeeklyResultRepository weeklyResultRepository;
    private final CompetitionRepository competitionRepository;

    @Transactional(readOnly = true)
    public List<ChampionshipStanding> getStandings(Long competitionId) {
        Competition competition = resolveCompetition(competitionId);
        return weeklyResultRepository.findChampionshipStandings(competition.getId());
    }

    private Competition resolveCompetition(Long competitionId) {
        if (competitionId != null) {
            return competitionRepository.findById(competitionId)
                    .orElseThrow(() -> new EntityNotFoundException("Competition not found: " + competitionId));
        }
        return competitionRepository.findFirstByIsActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active competition found!"));
    }
}
