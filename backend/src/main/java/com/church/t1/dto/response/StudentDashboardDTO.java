package com.church.t1.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StudentDashboardDTO {

    private StudentInfoDTO studentInfo;

    private WeeklyInfoDTO weeklyInfo;
}