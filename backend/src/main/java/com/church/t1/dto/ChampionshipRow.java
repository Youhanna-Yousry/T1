package com.church.t1.dto;

public record ChampionshipRow(
        String firstName,
        String lastName,
        String teamName,
        String teamCode,
        String teamColor,
        Integer totalPoints
) {}
