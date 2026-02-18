package com.church.t1.dto.response;

public record ChampionshipStanding(
        Integer rank,
        String firstName,
        String lastName,
        String teamName,
        String teamCode,
        String teamColor,
        Integer totalPoints
) {
    /** Projection constructor used by JPQL — rank is assigned post-query. */
    public ChampionshipStanding(
            String firstName,
            String lastName,
            String teamName,
            String teamCode,
            String teamColor,
            Integer totalPoints
    ) {
        this(null, firstName, lastName, teamName, teamCode, teamColor, totalPoints);
    }
}
