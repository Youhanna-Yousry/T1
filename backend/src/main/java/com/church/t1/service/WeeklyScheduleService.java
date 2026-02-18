package com.church.t1.service;

import com.church.t1.dto.response.EventCategory;
import com.church.t1.dto.response.EventProgress;
import com.church.t1.dto.response.WeeklyProgress;
import com.church.t1.mapper.AppMapper;
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
public class WeeklyScheduleService {

    private final EventRepository eventRepository;
    private final StudentLogRepository studentLogRepository;
    private final AppMapper appMapper;

    public WeeklyProgress getWeeklyProgress(User student, Week week) {
        List<Event> allEvents = eventRepository.findAll();
        Set<Long> attendedIds = studentLogRepository.findAttendedEventsByUserIdAndWeekId(student.getId(), week.getId());

        return WeeklyProgress.builder()
                .weekName(week.getName())
                .weekNumber(week.getWeekNumber())
                .grandPrix(buildCategory(allEvents, attendedIds, EventType.GRAND_PRIX))
                .sprint(buildCategory(allEvents, attendedIds, EventType.SPRINT))
                .practice(buildCategory(allEvents, attendedIds, EventType.PRACTICE))
                .build();
    }

    private EventCategory buildCategory(List<Event> events, Set<Long> attendedIds, EventType type) {
        List<EventProgress> progress = events.stream()
                .filter(e -> e.getType() == type)
                .map(e -> appMapper.toEventProgress(e, attendedIds.contains(e.getId())))
                .toList();

        return EventCategory.builder().events(progress).build();
    }
}