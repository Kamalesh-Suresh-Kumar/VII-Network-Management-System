package com.cogninet.backend.service;

import com.cogninet.backend.entity.Telemetry;
import com.cogninet.backend.repository.TelemetryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TelemetryService {

    private final TelemetryRepository telemetryRepository;

    public TelemetryService(TelemetryRepository telemetryRepository) {
        this.telemetryRepository = telemetryRepository;
    }

    public List<Telemetry> getAllTelemetry() {
        return telemetryRepository.findAll();
    }

    public Optional<Telemetry> getTelemetryById(Long id) {
        return telemetryRepository.findById(id);
    }

    public Telemetry saveTelemetry(Telemetry telemetry) {
        return telemetryRepository.save(telemetry);
    }

    public void deleteTelemetry(Long id) {
        telemetryRepository.deleteById(id);
    }
}
