package com.church.t1.dto.response;

import com.church.t1.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponseDTO {

    private String username;

    private Role role;

    private String token;
}
