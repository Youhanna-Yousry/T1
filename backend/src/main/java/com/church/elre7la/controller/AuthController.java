package com.church.elre7la.controller;

import com.church.elre7la.controller.request.AuthRequest;
import com.church.elre7la.controller.resopnse.AuthResponse;
import com.church.elre7la.entity.Account;
import com.church.elre7la.entity.RefreshToken;
import com.church.elre7la.repository.AccountRepository;
import com.church.elre7la.service.RefreshTokenService;
import com.church.elre7la.security.JwtUtils;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final AccountRepository accountRepository;

    private final JwtUtils jwtUtils;

    private final RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<@NonNull AuthResponse> login(@RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Account> optionalAccount = accountRepository.findByUsername(userDetails.getUsername());
        if (optionalAccount.isEmpty()) {
            return ResponseEntity.status(401).build();
        }

        Account account = optionalAccount.get();
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(account);
        String token = jwtUtils.generateToken(account.getUsername());

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refresh")
                .maxAge(Duration.ofMillis(jwtUtils.getJwtExpirationMs()))
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(account.getRole(), token));
    }

    @PostMapping("/refresh")
    public ResponseEntity<@NonNull AuthResponse> refresh(@CookieValue(name = "refreshToken", required = false) String refreshTokenCookie) {
        if (refreshTokenCookie == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<RefreshToken> optionalRefreshToken = refreshTokenService.findByToken(refreshTokenCookie);
        if (optionalRefreshToken.isEmpty()) {
            return ResponseEntity.status(401).build();
        }

        RefreshToken refreshToken = optionalRefreshToken.get();
        if (refreshToken.isRevoked() || refreshTokenService.isTokenExpired(refreshToken)) {
            return ResponseEntity.status(401).build();
        }

        refreshTokenService.revoke(refreshToken);
        Account account = refreshToken.getAccount();
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(account);
        String token = jwtUtils.generateToken(account.getUsername());

        ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefreshToken.getToken())
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refresh")
                .maxAge(Duration.ofMillis(jwtUtils.getJwtExpirationMs()))
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(account.getRole(), token));
    }

    @PostMapping("/logout")
    public ResponseEntity<@NonNull Void> logout(@CookieValue(name = "refreshToken", required = false) String refreshTokenCookie) {
        if (refreshTokenCookie != null) {
            refreshTokenService.findByToken(refreshTokenCookie).ifPresent(refreshTokenService::revoke);
        }

        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refresh")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, deleteCookie.toString()).build();
    }
}
