package com.church.t1.model.entity;

import com.church.t1.dto.response.ChampionshipStanding;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"week_id", "user_id"})
})
@NamedNativeQuery(
        name = "WeeklyResult.findChampionshipStandings",
        query = """
                SELECT
                    CAST(ROW_NUMBER() OVER (ORDER BY SUM(wr.championship_points) DESC) AS integer) AS rank,
                    u.first_name,
                    u.last_name,
                    tp.team_name,
                    tp.team_code,
                    tp.team_color,
                    CAST(COALESCE(SUM(wr.championship_points), 0) AS integer) AS total_points
                FROM weekly_result wr
                JOIN users u ON u.id = wr.user_id
                JOIN team_profile tp ON tp.family_id = wr.family_id AND tp.competition_id = wr.competition_id
                WHERE wr.competition_id = :competitionId AND u.role = 'STUDENT'
                GROUP BY u.id, u.first_name, u.last_name, tp.team_name, tp.team_code, tp.team_color
                ORDER BY total_points DESC
                """,
        resultSetMapping = "ChampionshipStandingMapping"
)
@SqlResultSetMapping(
        name = "ChampionshipStandingMapping",
        classes = @ConstructorResult(
                targetClass = ChampionshipStanding.class,
                columns = {
                        @ColumnResult(name = "rank",         type = Integer.class),
                        @ColumnResult(name = "first_name",   type = String.class),
                        @ColumnResult(name = "last_name",    type = String.class),
                        @ColumnResult(name = "team_name",    type = String.class),
                        @ColumnResult(name = "team_code",    type = String.class),
                        @ColumnResult(name = "team_color",   type = String.class),
                        @ColumnResult(name = "total_points", type = Integer.class),
                }
        )
)
public class WeeklyResult extends BasicEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id", nullable = false)
    private Competition competition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "week_id", nullable = false)
    private Week week;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;

    @Column(nullable = false)
    private Integer rawAttendanceScore = 0;

    @Column
    private Integer rankInWeek;

    @Column(nullable = false)
    private Integer championshipPoints = 0;
}
