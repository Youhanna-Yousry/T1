package com.church.t1.repository;

import com.church.t1.model.entity.Competition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompetitionRepository extends JpaRepository<Competition, Long> {

    Optional<Competition> findFirstByIsActiveTrue();
}