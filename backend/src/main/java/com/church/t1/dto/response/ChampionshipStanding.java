package com.church.t1.dto.response;

public record ChampionshipStanding(
        Integer rank,
        String firstName,
        String lastName,
        String teamName,
        String teamCode,
        String teamColor,
        Integer totalPoints
) {}
