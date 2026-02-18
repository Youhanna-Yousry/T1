package com.church.t1.dto.response;

import com.church.t1.model.enums.CompetitionStatus;
import lombok.Builder;

@Builder
public record CompetitionSummary(
        String name,
        Integer year,
        CompetitionStatus status
) {
}