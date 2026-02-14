package com.church.t1.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EventProgressDTO {

    private String name;

    private boolean isCompleted;
}