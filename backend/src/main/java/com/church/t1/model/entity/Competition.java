package com.church.t1.model.entity;

import com.church.t1.model.enums.FastType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Competition extends BasicEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FastType type;

    @Column(nullable = false)
    private Boolean isActive;
}
