package com.church.elre7la.service;

import com.church.elre7la.entity.Account;
import com.church.elre7la.entity.RefreshToken;
import com.church.elre7la.repository.RefreshTokenRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${app.auth.refreshToken.expirationMs}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshToken createRefreshToken(@NonNull Account account) {
        RefreshToken token = RefreshToken.builder().
                account(account).
                token(UUID.randomUUID().toString()).
                expiryDate(Instant.now().plusMillis(refreshTokenDurationMs)).
                build();

        return refreshTokenRepository.save(token);
    }

    public boolean isTokenExpired(RefreshToken token) {
        return token.getExpiryDate().isBefore(Instant.now());
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public void revoke(RefreshToken refreshToken) {
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
    }
}
