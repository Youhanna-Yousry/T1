package com.church.t1.model.entity;

import com.church.t1.model.enums.EventType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table
public class Event extends BasicEntity {

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType type;

    @Column(nullable = false)
    private boolean isScannable;

    @Column(nullable = false)
    private Integer weight;
}
