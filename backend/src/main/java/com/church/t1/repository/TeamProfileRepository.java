package com.church.t1.repository;

import com.church.t1.model.entity.TeamProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TeamProfileRepository extends JpaRepository<TeamProfile, Long> {

    @Query("SELECT tp FROM TeamProfile tp " +
            "JOIN tp.family f JOIN f.users u " +
            "WHERE u.username = :username AND tp.competition.id = :competitionId")
    Optional<TeamProfile> findTeamByUsernameAndCompetition(String username, Long competitionId);
}
