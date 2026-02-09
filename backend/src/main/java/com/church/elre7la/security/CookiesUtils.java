package com.church.elre7la.security;

import org.springframework.http.ResponseCookie;

import java.time.Duration;

public class CookiesUtils {

  private static final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
  private static final String REFRESH_ENDPOINT = "/api/auth/refresh";

  private CookiesUtils() {
  }

  public static ResponseCookie createRefreshTokenCookie(String refreshToken, long refreshTokenExpirationMs) {
    return ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, refreshToken) //
        .httpOnly(true) //
        .secure(true) //
        .path(REFRESH_ENDPOINT) //
        .maxAge(Duration.ofMillis(refreshTokenExpirationMs)) //
        .sameSite("Strict") //
        .build();
  }

  public static ResponseCookie createRefreshTokenDeletionCookie() {
    return ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, "") //
        .httpOnly(true) //
        .secure(true) //
        .path(REFRESH_ENDPOINT) //
        .maxAge(0) //
        .sameSite("Strict") //
        .build();
  }
}
