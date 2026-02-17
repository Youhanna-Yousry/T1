package com.church.t1.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StudentInfoDTO {

    private String firstName;

    private String lastName;

    private String teamName;

    private String teamCode;

    private String teamColor;

    private Integer championshipPoints;

    private Integer championshipRank;
}
