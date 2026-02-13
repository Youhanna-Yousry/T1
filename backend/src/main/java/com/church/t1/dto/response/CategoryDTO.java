package com.church.t1.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CategoryDTO {

    private int totalPoints;

    private List<EventProgressDTO> events;
}