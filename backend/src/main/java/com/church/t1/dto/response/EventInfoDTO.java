package com.church.t1.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EventInfoDTO {

    private long id;

    private String name;

    private int weight;
}
