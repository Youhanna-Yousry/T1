package com.church.t1.security;

import org.springframework.http.ResponseCookie;

import java.time.Duration;

public class CookiesUtils {

    public static final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
    private static final String REFRESH_ENDPOINT = "/api/auth/refresh";
    private static final String STRICT_SAME_SITE = "Strict";

    private CookiesUtils() {
    }

    public static ResponseCookie createRefreshTokenCookie(String refreshToken, long refreshTokenExpirationMs) {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(true)
                .path(REFRESH_ENDPOINT)
                .maxAge(Duration.ofMillis(refreshTokenExpirationMs))
                .sameSite(STRICT_SAME_SITE)
                .build();
    }

    public static ResponseCookie createRefreshTokenDeletionCookie() {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(true)
                .path(REFRESH_ENDPOINT)
                .maxAge(0)
                .sameSite(STRICT_SAME_SITE)
                .build();
    }
}
