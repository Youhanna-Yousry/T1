package com.church.t1.repository;

import com.church.t1.model.entity.User;
import com.church.t1.repository.projection.StudentSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    @Query(value = """
                SELECT
                    u.id as id,
                    u.first_name || ' ' || u.last_name as name,
                    DENSE_RANK() OVER (ORDER BY u.total_points DESC) as rank,
                    u.total_points as totalPoints,
                    tf.team_name as teamName,
                    tf.team_code as teamCode
                FROM users u
                LEFT JOIN family f ON u.family_id = f.id
                LEFT JOIN team_profile tf ON f.id = tf.family_id
                WHERE u.username = :username
            """, nativeQuery = true)
    Optional<StudentSummary> findStudentSummary(String username);
}