package com.church.t1.controller.resopnse;

import com.church.t1.entity.Account;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {

    private Account.Role role;

    private String token;
}
