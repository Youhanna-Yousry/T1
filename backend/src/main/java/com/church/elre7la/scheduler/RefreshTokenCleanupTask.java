package com.church.elre7la.scheduler;

import com.church.elre7la.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenCleanupTask {

  private final RefreshTokenRepository refreshTokenRepository;

  @Value("${app.auth.refreshToken.cleanupDays}")
  private int cleanupDays;

  @Scheduled(cron = "${app.auth.refreshToken.cleanupCron}")
  public void cleanUpExpiredTokens() {
    ZonedDateTime now = ZonedDateTime.now();
    ZonedDateTime cutoff = now.minusDays(cleanupDays);

    int deletedTokensCount = refreshTokenRepository.deleteOldTokens(cutoff.toInstant());

    log.info("Cleaned up {} expired or revoked refresh tokens older than {} at {}", deletedTokensCount, cutoff, now);
  }
}
