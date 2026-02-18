package com.church.t1.dto.response;

import lombok.Builder;
import java.util.List;

@Builder
public record EventCategory(
        List<EventProgress> events
) {}