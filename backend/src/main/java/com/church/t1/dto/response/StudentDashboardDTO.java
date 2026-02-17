package com.church.t1.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StudentDashboardDTO {

    private CompetitionInfoDTO competitionInfo;

    private StudentInfoDTO driverInfo;

    private WeeklyInfoDTO trackData;
}