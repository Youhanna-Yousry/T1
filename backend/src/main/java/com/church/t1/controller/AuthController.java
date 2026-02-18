package com.church.t1.controller;

import com.church.t1.dto.request.AuthRequest;
import com.church.t1.dto.response.AuthResponse;
import com.church.t1.security.CookiesUtils;
import com.church.t1.service.AuthService;
import com.church.t1.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.church.t1.security.CookiesUtils.REFRESH_TOKEN_COOKIE_NAME;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthService.AuthResult result = authService.login(request);
        return buildResponse(result);
    }

    private ResponseEntity<AuthResponse> buildResponse(AuthService.AuthResult result) {
        var cookie = CookiesUtils.createRefreshTokenCookie(
                result.refreshToken().getToken(),
                refreshTokenService.getRefreshTokenExpirationMs()
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(result.response());
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@CookieValue(name = REFRESH_TOKEN_COOKIE_NAME, required = false) String refreshToken) {
        if (refreshToken == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            AuthService.AuthResult result = authService.refresh(refreshToken);
            return buildResponse(result);
        } catch (IllegalArgumentException _) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@CookieValue(name = REFRESH_TOKEN_COOKIE_NAME, required = false) String refreshToken) {
        if (refreshToken != null) {
            refreshTokenService.findByToken(refreshToken).ifPresent(refreshTokenService::revoke);
        }

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, CookiesUtils.createRefreshTokenDeletionCookie().toString())
                .build();
    }
}