package com.church.t1.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarkAttendanceDTO {

    private long eventId;

    private String email;

    private int weight;
}
