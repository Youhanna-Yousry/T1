package com.church.t1.dto.request;

public record AuthRequest(
        String username,
        String password
) {
    public AuthRequest {
        username = username != null ? username.strip().toLowerCase() : null;
        password = password != null ? password.strip() : null;
    }
}
