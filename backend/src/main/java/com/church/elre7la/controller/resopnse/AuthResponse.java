package com.church.elre7la.controller.resopnse;

import com.church.elre7la.entity.Account;
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
