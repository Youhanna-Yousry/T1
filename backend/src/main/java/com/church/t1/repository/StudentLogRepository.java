package com.church.t1.repository;

import com.church.t1.model.entity.StudentLog;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface StudentLogRepository extends JpaRepository<StudentLog, Long> {

    @Query("SELECT sl.event.id FROM StudentLog sl WHERE sl.user.id = :userId AND sl.week.id = :weekId")
    Set<Long> findAttendedEventsByUserIdAndWeekId(Long userId, Long weekId);

    @Modifying
    @Transactional
    @Query(value = """
            INSERT INTO student_log (event_id, points_earned, user_id, week_id)
            SELECT :eventId, :weight, u.id, w.id
            FROM users u, week w
            WHERE u.email = :email AND CURRENT_DATE BETWEEN w.start_date AND w.end_date
            """, nativeQuery = true)
    int logStudentAttendance(String email, Long eventId, Integer weight);
}
