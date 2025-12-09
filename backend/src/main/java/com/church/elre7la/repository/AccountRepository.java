package com.church.elre7la.repository;

import com.church.elre7la.entity.Account;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<@NonNull Account, @NonNull Long> {

    Optional<Account> findByUsername(String username);
}