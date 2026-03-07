package com.church.t1.repository;

import com.church.t1.model.entity.Week;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface WeekRepository extends JpaRepository<Week, Long> {

    @Query("SELECT w FROM Week w WHERE w.competition.id = :competitionId " +
            "AND :now BETWEEN w.startDate AND w.endDate")
    Optional<Week> findCurrentWeek(Long competitionId, Instant now);

    Optional<Week> findFirstByCompetitionIdOrderByWeekNumberAsc(Long competitionId);

    Optional<Week> findFirstByEndDateBeforeOrderByEndDateDesc(Instant now);

    @Query("SELECT w FROM Week w WHERE w.competition.id = :competitionId AND w.endDate < :now ORDER BY w.endDate DESC")
    List<Week> findFinishedWeeks(Long competitionId, Instant now);
}