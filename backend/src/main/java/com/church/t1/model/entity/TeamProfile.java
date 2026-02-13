package com.church.t1.model.entity;

import com.church.t1.model.enums.FastType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(uniqueConstraints = {
        @UniqueConstraint(
                columnNames = {"family_id", "year", "fast_type"}
        )
})
public class TeamProfile extends BasicEntity {

    @Column(nullable = false)
    private Integer year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FastType fastType;

    @Column(nullable = false)
    private String teamName;

    @Column(nullable = false)
    private String teamCode;

    @Column
    private String logoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;
}
