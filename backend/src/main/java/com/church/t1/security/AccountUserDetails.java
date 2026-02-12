package com.church.t1.security;

import com.church.t1.entity.Account;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@AllArgsConstructor
public class AccountUserDetails implements UserDetails {

    private Account account;

    @Override
    @NonNull
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + account.getRole().name()));
    }

    @Override
    @NonNull
    public String getPassword() {
        return account.getPassword();
    }

    @Override
    @NonNull
    public String getUsername() {
        return account.getUsername();
    }
}