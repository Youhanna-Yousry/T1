package com.church.t1.repository;

import com.church.t1.model.entity.StudentLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface StudentLogRepository extends JpaRepository<StudentLog, Long> {

    @Query("SELECT sl.event.id FROM StudentLog sl WHERE sl.user.id = :userId AND sl.week.id = :weekId")
    Set<Long> findAttendedEventsByUserIdAndWeekId(Long userId, Long weekId);
}
