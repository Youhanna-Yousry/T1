package com.church.t1.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Getter
@Setter
@Table
public class Week extends BasicEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer weekNumber;

    private Instant startDate;

    private Instant endDate;
}