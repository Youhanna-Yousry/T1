package com.church.t1.dto.response;

import com.church.t1.model.enums.CompetitionStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompetitionInfoDTO {

    private String name;

    private Integer year;

    private CompetitionStatus status;
}
