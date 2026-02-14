package com.church.t1.service;

import com.church.t1.dto.response.*;
import com.church.t1.model.entity.Event;
import com.church.t1.model.entity.Week;
import com.church.t1.model.enums.EventType;
import com.church.t1.repository.EventRepository;
import com.church.t1.repository.StudentLogRepository;
import com.church.t1.repository.UserRepository;
import com.church.t1.repository.WeekRepository;
import com.church.t1.repository.projection.StudentSummary;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class StudentDashboardService {

    private final UserRepository userRepository;

    private final WeekRepository weekRepository;

    private final EventRepository eventRepository;

    private final StudentLogRepository studentLogRepository;

    public StudentDashboardDTO getStudentDashboard(String username) {
        StudentSummary studentSummary = userRepository.findStudentSummary(username)
                .orElseThrow(EntityNotFoundException::new);

        Week currentWeek = weekRepository.findCurrentWeek()
                .orElseThrow(() -> new RuntimeException("No active race week found!"));

        List<Event> weeklyEvents = eventRepository.findAll();

        Set<Long> attendedEventIds = studentLogRepository.findAttendedEventsByUserIdAndWeekId(studentSummary.getId(),
                currentWeek.getId());

        CategoryDTO grandPrix = buildCategory(weeklyEvents, attendedEventIds, EventType.GRAND_PRIX);
        CategoryDTO sprint = buildCategory(weeklyEvents, attendedEventIds, EventType.SPRINT);
        CategoryDTO practice = buildCategory(weeklyEvents, attendedEventIds, EventType.PRACTICE);

        StudentInfoDTO driver = StudentInfoDTO.builder()
                .name(studentSummary.getName())
                .totalPoints(studentSummary.getTotalPoints())
                .rank(studentSummary.getRank())
                .teamCode(studentSummary.getTeamCode())
                .teamName(studentSummary.getTeamName())
                .teamColor(studentSummary.getTeamColor())
                .build();

        return StudentDashboardDTO.builder()
                .studentInfo(driver)
                .weeklyInfo(WeeklyInfoDTO.builder()
                        .weekName(currentWeek.getName())
                        .grandPrix(grandPrix)
                        .sprint(sprint)
                        .practice(practice)
                        .build())
                .build();
    }

    private CategoryDTO buildCategory(List<Event> allEvents, Set<Long> attendedEventIds, EventType type) {
        List<EventProgressDTO> eventProgressDTOs = allEvents.stream()
                .filter(e -> e.getType() == type)
                .map(event -> {
                    boolean isEventAttended = attendedEventIds.contains(event.getId());
                    return EventProgressDTO.builder()
                            .name(event.getName())
                            .isCompleted(isEventAttended)
                            .build();
                })
                .toList();

        return CategoryDTO.builder()
                .events(eventProgressDTOs)
                .build();
    }

}