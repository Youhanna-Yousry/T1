package com.church.t1.service;

import com.church.t1.dto.request.AuthRequest;
import com.church.t1.dto.response.AuthResponse;
import com.church.t1.model.entity.RefreshToken;
import com.church.t1.model.entity.User;
import com.church.t1.repository.UserRepository;
import com.church.t1.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtils jwtUtils;

    public record AuthResult(RefreshToken refreshToken, AuthResponse response) {
    }

    public AuthResult login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        String jwt = jwtUtils.generateToken(user.getUsername());

        return new AuthResult(refreshToken, new AuthResponse(user.getUsername(), user.getRole(), jwt));
    }

    @Transactional
    public AuthResult refresh(String incomingRefreshToken) {
        return refreshTokenService.findByToken(incomingRefreshToken)
                .map(this::processRefresh)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token is not found!"));
    }

    private AuthResult processRefresh(RefreshToken token) {
        if (token.isRevoked() || refreshTokenService.isTokenExpired(token)) {
            throw new IllegalArgumentException("Refresh token was expired or revoked");
        }

        refreshTokenService.revoke(token);

        User user = token.getUser();
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);
        String newJwt = jwtUtils.generateToken(user.getUsername());

        return new AuthResult(newRefreshToken, new AuthResponse(user.getUsername(), user.getRole(), newJwt));
    }
}