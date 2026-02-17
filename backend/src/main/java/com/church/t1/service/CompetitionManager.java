package com.church.t1.service;

import com.church.t1.model.entity.Competition;
import com.church.t1.model.entity.Week;
import com.church.t1.repository.CompetitionRepository;
import com.church.t1.repository.WeekRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class CompetitionManager {

    private final CompetitionRepository competitionRepository;
    private final WeekRepository weekRepository;

    CompetitionContext resolveContext(Long competitionId, Long weekId) {
        Competition competition = resolveCompetition(competitionId);
        Week week = resolveWeek(competition, weekId);
        return new CompetitionContext(competition, week);
    }

    private Competition resolveCompetition(Long id) {
        if (id != null) {
            return competitionRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Competition not found: " + id));
        }
        return competitionRepository.findFirstByIsActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active competition found!"));
    }

    private Week resolveWeek(Competition competition, Long weekId) {
        if (weekId != null) {
            return weekRepository.findById(weekId)
                    .orElseThrow(() -> new EntityNotFoundException("Week not found: " + weekId));
        }

        return weekRepository.findCurrentWeek(competition.getId(), Instant.now())
                .or(() -> weekRepository.findFirstByCompetitionIdOrderByWeekNumberAsc(competition.getId()))
                .orElseThrow(() -> new RuntimeException("No weeks setup for: " + competition.getName()));
    }
}

record CompetitionContext(Competition competition, Week week) {
}