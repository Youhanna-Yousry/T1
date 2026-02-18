package com.church.t1.dto.response;

import lombok.Builder;

@Builder
public record StudentDashboard(
        CompetitionSummary competition,
        StudentProfile studentProfile,
        WeeklyProgress weeklyProgress
) {
}