package com.church.t1.repository;

import com.church.t1.model.entity.Week;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeekRepository extends JpaRepository<Week, Long> {

    @Query("SELECT w FROM Week w WHERE CURRENT_TIMESTAMP BETWEEN w.startDate AND w.endDate")
    Optional<Week> findCurrentWeek();

    @Query("SELECT w FROM Week w WHERE CURRENT_TIMESTAMP > w.startDate")
    List<Week> findAllFinishedAndOngoingWeeks();
}