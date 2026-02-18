package com.church.t1.service;

import com.church.t1.dto.response.StudentProfile;
import com.church.t1.mapper.AppMapper;
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
public class StudentStatisticsService {

    private final TeamProfileRepository teamProfileRepository;
    private final WeeklyResultRepository weeklyResultRepository;
    private final AppMapper appMapper;

    public StudentProfile getStudentProfile(User student, Competition competition) {
        TeamProfile team = teamProfileRepository.findTeamByUsernameAndCompetition(student.getUsername(), competition.getId())
                .orElseThrow(() -> new EntityNotFoundException("No team assigned for current competition"));

        Integer totalPoints = weeklyResultRepository.getStudentTotalPoints(student.getUsername(), competition.getId());
        Integer rank = weeklyResultRepository.calculateRank(competition.getId(), totalPoints);

        if (rank == null) rank = 1;

        return appMapper.toStudentStatistics(student, team, totalPoints, rank);
    }
}