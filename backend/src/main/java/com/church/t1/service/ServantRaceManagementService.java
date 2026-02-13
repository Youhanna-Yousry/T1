package com.church.t1.service;

import com.church.t1.dto.response.LookupDTO;
import com.church.t1.repository.EventRepository;
import com.church.t1.repository.WeekRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServantRaceManagementService {

    private final EventRepository eventRepository;

    private final WeekRepository weekRepository;

    public List<LookupDTO> getAvailableEvents() {
        return eventRepository.findAll()
                .stream()
                .map(event -> new LookupDTO(event.getId(), event.getName()))
                .toList();
    }

    public List<LookupDTO> getAvailableWeeks() {
        return weekRepository.findAllFinishedAndOngoingWeeks().stream()
                .map(week -> new LookupDTO(week.getId(), week.getName()))
                .toList();
    }
}
