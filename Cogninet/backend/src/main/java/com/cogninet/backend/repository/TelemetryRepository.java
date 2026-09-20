package com.cogninet.backend.repository;

import com.cogninet.backend.entity.Telemetry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TelemetryRepository extends JpaRepository<Telemetry, Long> {
}
