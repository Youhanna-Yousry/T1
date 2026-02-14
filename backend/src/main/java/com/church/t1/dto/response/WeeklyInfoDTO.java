package com.church.t1.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WeeklyInfoDTO {

    private String weekName;

    private CategoryDTO grandPrix;

    private CategoryDTO sprint;

    private CategoryDTO practice;
}