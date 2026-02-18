package com.church.t1.dto.response;

import lombok.Builder;

@Builder
public record EventSummary(
        long id,
        String name,
        int points
) {
}