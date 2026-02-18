package com.church.t1.dto.request;

public record AuthRequest(
        String username,
        String password
) {}