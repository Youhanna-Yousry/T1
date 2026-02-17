package com.church.t1.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Getter
@Setter
public class Week extends BasicEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id", referencedColumnName = "id", nullable = false)
    private Competition competition;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer weekNumber;

    private Instant startDate;

    private Instant endDate;
}