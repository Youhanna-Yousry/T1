package com.church.t1.service;

import com.church.t1.dto.response.StudentInfoDTO;
import com.church.t1.model.entity.Competition;
import com.church.t1.model.entity.TeamProfile;
import com.church.t1.model.entity.User;
import com.church.t1.repository.TeamProfileRepository;
import com.church.t1.repository.WeeklyResultRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DriverTelemetryService {

    private final TeamProfileRepository teamProfileRepository;
    private final WeeklyResultRepository weeklyResultRepository;

    public StudentInfoDTO getDriverStats(User user, Competition competition) {
        TeamProfile team = teamProfileRepository.findTeamByUsernameAndCompetition(user.getUsername(), competition.getId())
                .orElseThrow(() -> new EntityNotFoundException("No team assigned for " + competition.getName()));

        Integer totalPoints = weeklyResultRepository.getStudentTotalPoints(user.getUsername(), competition.getId());
        Integer rank = weeklyResultRepository.calculateRank(competition.getId(), totalPoints);

        if (rank == null) rank = 1;

        return StudentInfoDTO.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .teamName(team.getTeamName())
                .teamCode(team.getTeamCode())
                .teamColor(team.getTeamColor())
                .championshipPoints(totalPoints)
                .championshipRank(rank)
                .build();
    }
}
