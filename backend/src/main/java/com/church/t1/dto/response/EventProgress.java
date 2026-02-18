package com.church.t1.dto.response;

import lombok.Builder;

@Builder
public record EventProgress(
        String name,
        boolean isCompleted
) {
}