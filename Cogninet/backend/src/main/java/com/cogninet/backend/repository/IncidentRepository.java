package com.cogninet.backend.repository;

import com.cogninet.backend.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    Optional<Incident> findByIncidentId(String incidentId);

    Optional<Incident> findByIncidentIdAndStatus(
            String incidentId,
            String status
    );
}