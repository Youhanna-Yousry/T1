package com.church.elre7la.repository;

import com.church.elre7la.entity.RefreshToken;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<@NonNull RefreshToken, @NonNull Long> {

  Optional<RefreshToken> findByToken(String token);

  @Transactional
  @Modifying
  @Query("""
          DELETE FROM RefreshToken t
          WHERE (t.revoked = true OR t.expiryDate < CURRENT_TIMESTAMP())
          AND t.updatedAt < :cutoff
      """)
  int deleteOldTokens(Instant cutoff);
}
