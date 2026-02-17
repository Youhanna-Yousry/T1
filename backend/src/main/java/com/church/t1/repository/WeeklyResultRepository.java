package com.church.t1.repository;

import com.church.t1.model.entity.WeeklyResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WeeklyResultRepository extends JpaRepository<WeeklyResult, Long> {

    @Query("SELECT COALESCE(SUM(wr.championshipPoints), 0) FROM WeeklyResult wr " +
            "WHERE wr.user.username = :username AND wr.competition.id = :competitionId")
    Integer getStudentTotalPoints(String username, Long competitionId);

    @Query("SELECT COUNT(DISTINCT wr.user.id) + 1 FROM WeeklyResult wr " +
            "WHERE wr.competition.id = :competitionId " +
            "GROUP BY wr.user.id " +
            "HAVING SUM(wr.championshipPoints) > :myPoints")
    Integer calculateRank(Long competitionId, Integer myPoints);
}