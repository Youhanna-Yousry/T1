package com.church.t1.dto.response;

import lombok.Builder;

@Builder
public record StudentProfile(
        String firstName,
        String lastName,
        String teamName,
        String teamCode,
        String teamColor,
        Integer totalPoints,
        Integer rank
) {}