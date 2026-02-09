package com.church.elre7la.service;

import com.church.elre7la.entity.Account;
import com.church.elre7la.repository.AccountRepository;
import com.church.elre7la.security.AccountUserDetails;
import jakarta.annotation.Nullable;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

  private final AccountRepository accountRepository;

  @Override
  @NonNull
  public UserDetails loadUserByUsername(@Nullable String username) throws UsernameNotFoundException {
    Account account = accountRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

    return new AccountUserDetails(account);
  }
}