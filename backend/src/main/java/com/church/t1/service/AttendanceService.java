package com.church.t1.service;

import com.church.t1.dto.request.AttendanceRequest;
import com.church.t1.dto.response.EventSummary;
import com.church.t1.exception.StudentAlreadyRegisteredException;
import com.church.t1.exception.StudentNotFoundException;
import com.church.t1.mapper.AppMapper;
import com.church.t1.model.enums.Role;
import com.church.t1.repository.EventRepository;
import com.church.t1.repository.StudentLogRepository;
import com.church.t1.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final EventRepository eventRepository;
    private final StudentLogRepository studentLogRepository;
    private final AppMapper appMapper;
    private final UserRepository userRepository;

    public List<EventSummary> getEvents(boolean scannable) {
        return eventRepository.findByIsScannable(scannable)
                .stream()
                .map(appMapper::toEventSummary)
                .toList();
    }

    @Transactional
    public void registerAttendance(AttendanceRequest attendanceRequest) {
        try {
            int rowsAffected = studentLogRepository.logStudentAttendance(
                    attendanceRequest.username(),
                    attendanceRequest.eventId(),
                    attendanceRequest.points()
            );

            if (rowsAffected == 0) {
                log.warn("Failed attendance attempt: User not found: {}", attendanceRequest.username());
                throw new StudentNotFoundException("No student found with username: " + attendanceRequest.username());
            }

        } catch (DataIntegrityViolationException _) {
            log.warn("Duplicate attendance attempt for user: {} on eventId: {}",
                    attendanceRequest.username(), attendanceRequest.eventId());
            throw new StudentAlreadyRegisteredException("User is already registered for this event.");
        }
    }

    public List<String> findStudents(String query) {
        return userRepository.searchUsernamesByRole(query, Role.STUDENT, Pageable.ofSize(10));
    }
}