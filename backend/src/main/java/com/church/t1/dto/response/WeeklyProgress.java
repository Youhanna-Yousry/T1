package com.church.t1.dto.response;

import lombok.Builder;

@Builder
public record WeeklyProgress(
        String weekName,
        Integer weekNumber,
        EventCategory grandPrix,
        EventCategory sprint,
        EventCategory practice
) {}