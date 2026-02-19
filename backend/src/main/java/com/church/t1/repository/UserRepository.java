package com.church.t1.repository;

import com.church.t1.model.entity.User;
import com.church.t1.model.enums.Role;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    @Query("SELECT u.username FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) AND u.role = :role")
    List<String> searchUsernamesByRole(String query, Role role, Pageable pageable);
}