package com.church.t1.service;

import com.church.t1.dto.response.DashboardHeader;
import com.church.t1.dto.response.WeeklyProgress;
import com.church.t1.mapper.AppMapper;
import com.church.t1.model.entity.User;
import com.church.t1.repository.UserRepository;
import com.church.t1.service.CompetitionContextService.Context;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentFacade {

    private final UserRepository userRepository;
    private final CompetitionContextService competitionContextService;
    private final StudentStatisticsService studentStatisticsService;
    private final WeeklyScheduleService weeklyScheduleService;
    private final AppMapper appMapper;

    @Transactional(readOnly = true)
    public DashboardHeader getDashboardHeader(String username, Long competitionId) {
        User student = getUserOrThrow(username);
        Context ctx = competitionContextService.resolveContext(competitionId, null);

        return DashboardHeader.builder()
                .competition(appMapper.toCompetitionSummary(ctx.competition()))
                .studentProfile(studentStatisticsService.getStudentProfile(student, ctx.competition()))
                .build();
    }

    @Transactional(readOnly = true)
    public WeeklyProgress getWeeklyProgress(String username, Long competitionId, Long weekId) {
        User student = getUserOrThrow(username);
        Context ctx = competitionContextService.resolveContext(competitionId, weekId);

        return weeklyScheduleService.getWeeklyProgress(student, ctx.week());
    }

    private User getUserOrThrow(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Student user not found: " + username));
    }
}