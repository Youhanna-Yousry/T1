package com.church.t1.service;

import com.church.t1.dto.request.AttendanceRequest;
import com.church.t1.dto.response.EventSummary;
import com.church.t1.mapper.AppMapper;
import com.church.t1.model.enums.AttendanceStatus;
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
    public AttendanceStatus registerAttendance(AttendanceRequest attendanceRequest) {
        try {
            int rowsAffected = studentLogRepository.logStudentAttendance(
                    attendanceRequest.username(),
                    attendanceRequest.eventId(),
                    attendanceRequest.points()
            );

            if (rowsAffected == 0) {
                return AttendanceStatus.USER_NOT_FOUND;
            }

            return AttendanceStatus.USER_REGISTERED_SUCCESSFULLY;

        } catch (DataIntegrityViolationException _) {
            log.error("Trying to re-register attendance for user: {} for eventId: {}", attendanceRequest.username(),
                    attendanceRequest.eventId());
           return AttendanceStatus.USER_ALREADY_REGISTERED;
        }
    }

    public List<String> findStudents(String query) {
        return userRepository.searchUsernamesByRole(query, Role.STUDENT, Pageable.ofSize(10));
    }
}