package com.church.t1.repository;

import com.church.t1.dto.response.StudentProfile;
import com.church.t1.model.entity.WeeklyResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WeeklyResultRepository extends JpaRepository<WeeklyResult, Long> {

    @Query("SELECT COALESCE(SUM(wr.championshipPoints), 0) FROM WeeklyResult wr " +
            "WHERE wr.user.username = :username AND wr.competition.id = :competitionId")
    Integer getStudentTotalPoints(String username, Long competitionId);

    @Query("SELECT COUNT(DISTINCT wr.user.id) + 1 FROM WeeklyResult wr " +
            "WHERE wr.competition.id = :competitionId " +
            "GROUP BY wr.user.id " +
            "HAVING SUM(wr.championshipPoints) > :myPoints")
    Integer calculateRank(Long competitionId, Integer myPoints);

    List<WeeklyResult> findByWeekId(Long weekId);

    @Query(value = """
            SELECT
                u.first_name AS firstName,
                u.last_name AS lastName,
                tp.team_name AS teamName,
                tp.team_code AS teamCode,
                tp.team_color AS teamColor,
                CAST(COALESCE(SUM(wr.championship_points), 0) AS integer) AS totalPoints,
                CAST(RANK() OVER (ORDER BY SUM(wr.championship_points) DESC) AS integer) AS rank
            FROM users u
            JOIN weekly_result wr ON u.id = wr.user_id
            JOIN team_profile tp ON tp.family_id = u.family_id AND tp.competition_id = :competitionId
            WHERE wr.competition_id = :competitionId AND u.role = 'STUDENT'
            GROUP BY u.id, u.first_name, u.last_name, tp.team_name, tp.team_code, tp.team_color
            ORDER BY totalPoints DESC
            """, nativeQuery = true)
    List<StudentProfile> findChampionshipDriversStandings(@Param("competitionId") Long competitionId);
}