package com.church.t1.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StudentInfoDTO {

    private String name;

    private int rank;

    private int totalPoints;

    private String teamName;

    private String teamCode;
}
