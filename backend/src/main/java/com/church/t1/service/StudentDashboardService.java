package com.church.t1.service;

import com.church.t1.dto.response.StudentDashboardDTO;
import com.church.t1.dto.response.StudentInfoDTO;
import com.church.t1.dto.response.WeeklyInfoDTO;
import com.church.t1.dto.response.CompetitionInfoDTO;
import com.church.t1.model.entity.Competition;
import com.church.t1.model.entity.User;
import com.church.t1.model.enums.CompetitionStatus;
import com.church.t1.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentDashboardService {

    private final UserRepository userRepository;

    private final CompetitionManager competitionManager;

    private final DriverTelemetryService driverTelemetryService;

    private final RaceControlService raceControlService;

    @Transactional(readOnly = true)
    public StudentDashboardDTO getStudentDashboard(String username, Long competitionId, Long weekId) {
        User driver = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Driver (User) not found: " + username));

        CompetitionContext context = competitionManager.resolveContext(competitionId, weekId);

        StudentInfoDTO driverStats = driverTelemetryService.getDriverStats(driver, context.competition());

        WeeklyInfoDTO trackData = raceControlService.getTrackData(driver, context.week());

        return StudentDashboardDTO.builder()
                .competitionInfo(mapToInfo(context.competition()))
                .driverInfo(driverStats)
                .trackData(trackData)
                .build();
    }

    private CompetitionInfoDTO mapToInfo(Competition competition) {
        return CompetitionInfoDTO.builder()
                .name(competition.getName())
                .year(competition.getYear())
                .status(Boolean.TRUE.equals(competition.getIsActive()) ? CompetitionStatus.ACTIVE : CompetitionStatus.ARCHIVED)
                .build();
    }
}