package com.church.t1.controller;

import com.church.t1.dto.request.AuthRequestDTO;
import com.church.t1.dto.response.AuthResponseDTO;
import com.church.t1.model.entity.RefreshToken;
import com.church.t1.model.entity.User;
import com.church.t1.repository.UserRepository;
import com.church.t1.security.CookiesUtils;
import com.church.t1.security.JwtUtils;
import com.church.t1.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import static com.church.t1.security.CookiesUtils.REFRESH_TOKEN_COOKIE_NAME;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final JwtUtils jwtUtils;

    private final RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found after authentication"));

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        String token = jwtUtils.generateToken(user.getUsername());

        ResponseCookie cookie = CookiesUtils.createRefreshTokenCookie(
                refreshToken.getToken(),
                refreshTokenService.getRefreshTokenExpirationMs()
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponseDTO(user.getUsername(), user.getRole(), token));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDTO> refresh(@CookieValue(name = REFRESH_TOKEN_COOKIE_NAME, required = false) String refreshTokenCookie) {
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
        User user = refreshToken.getUser();
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);
        String token = jwtUtils.generateToken(user.getUsername());

        ResponseCookie cookie = CookiesUtils.createRefreshTokenCookie(
                newRefreshToken.getToken(),
                refreshTokenService.getRefreshTokenExpirationMs()
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponseDTO(user.getUsername(), user.getRole(), token));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@CookieValue(name = REFRESH_TOKEN_COOKIE_NAME, required = false) String refreshTokenCookie) {
        if (refreshTokenCookie != null) {
            refreshTokenService.findByToken(refreshTokenCookie).ifPresent(refreshTokenService::revoke);
        }

        ResponseCookie deleteCookie = CookiesUtils.createRefreshTokenDeletionCookie();

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .build();
    }
}