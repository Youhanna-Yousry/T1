package com.church.elre7la.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.*;

import java.time.Instant;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken extends BasicEntity {

  @OneToOne
  @JoinColumn(name = "account_id", referencedColumnName = "id")
  private Account account;

  @Column(nullable = false, unique = true)
  private String token;

  @Column(nullable = false)
  private boolean revoked;

  @Column(nullable = false)
  private Instant expiryDate;
}
