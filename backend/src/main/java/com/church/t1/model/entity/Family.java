package com.church.t1.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Family extends BasicEntity {

    @OneToMany(mappedBy = "family", cascade = CascadeType.ALL)
    private List<TeamProfile> teamHistory;

    @OneToMany(mappedBy = "family", cascade = CascadeType.ALL)
    private List<User> users;

    @Column(nullable = false, unique = true)
    private Integer grade;

    @Column(nullable = false)
    private String name;
}
