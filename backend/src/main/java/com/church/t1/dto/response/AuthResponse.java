package com.church.t1.dto.response;

import com.church.t1.model.enums.Role;

public record AuthResponse(
        String username,
        Role role,
        String token
) {
}