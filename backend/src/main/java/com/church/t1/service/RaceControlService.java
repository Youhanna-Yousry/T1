package com.church.t1.service;

import com.church.t1.dto.response.CategoryDTO;
import com.church.t1.dto.response.EventProgressDTO;
import com.church.t1.dto.response.WeeklyInfoDTO;
import com.church.t1.model.entity.Event;
import com.church.t1.model.entity.User;
import com.church.t1.model.entity.Week;
import com.church.t1.model.enums.EventType;
import com.church.t1.repository.EventRepository;
import com.church.t1.repository.StudentLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RaceControlService {

    private final EventRepository eventRepository;
    private final StudentLogRepository studentLogRepository;

    public WeeklyInfoDTO getTrackData(User user, Week week) {
        List<Event> allEvents = eventRepository.findAll();
        Set<Long> attendedIds = studentLogRepository.findAttendedEventsByUserIdAndWeekId(user.getId(), week.getId());

        return WeeklyInfoDTO.builder()
                .weekName(week.getName())
                .weekNumber(week.getWeekNumber())
                .grandPrix(buildCategory(allEvents, attendedIds, EventType.GRAND_PRIX))
                .sprint(buildCategory(allEvents, attendedIds, EventType.SPRINT))
                .practice(buildCategory(allEvents, attendedIds, EventType.PRACTICE))
                .build();
    }

    private CategoryDTO buildCategory(List<Event> events, Set<Long> attendedIds, EventType type) {
        List<EventProgressDTO> progress = events.stream()
                .filter(e -> e.getType() == type)
                .map(e -> EventProgressDTO.builder()
                        .name(e.getName())
                        .isCompleted(attendedIds.contains(e.getId()))
                        .build())
                .toList();

        return CategoryDTO.builder().events(progress).build();
    }
}