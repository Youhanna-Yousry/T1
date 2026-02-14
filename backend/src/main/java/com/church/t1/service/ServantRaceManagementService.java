package com.church.t1.service;

import com.church.t1.dto.request.MarkAttendanceDTO;
import com.church.t1.dto.response.EventInfoDTO;
import com.church.t1.model.enums.AttendanceStatus;
import com.church.t1.repository.EventRepository;
import com.church.t1.repository.StudentLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServantRaceManagementService {

    private final EventRepository eventRepository;

    private final StudentLogRepository studentLogRepository;

    public List<EventInfoDTO> getEvents(boolean scannable) {
        return eventRepository.findByIsScannable(scannable)
                .stream()
                .map(event -> new EventInfoDTO(event.getId(), event.getName(), event.getWeight()))
                .toList();
    }

    public AttendanceStatus markAttendance(MarkAttendanceDTO markAttendanceDTO) {
        try {
            int rowsAffected = studentLogRepository.logStudentAttendance(markAttendanceDTO.getEmail(),
                    markAttendanceDTO.getEventId(), markAttendanceDTO.getWeight());

            if (rowsAffected == 0) {
                return AttendanceStatus.USER_NOT_FOUND;
            }

            return AttendanceStatus.USER_REGISTERED_SUCCESSFULLY;
        } catch (DataIntegrityViolationException _) {
            return AttendanceStatus.USER_ALREADY_REGISTERED;
        }
    }
}
