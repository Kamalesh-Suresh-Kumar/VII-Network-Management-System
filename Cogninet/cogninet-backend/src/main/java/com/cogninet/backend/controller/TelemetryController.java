package com.cogninet.backend.controller;

import com.cogninet.backend.entity.Telemetry;
import com.cogninet.backend.service.TelemetryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/telemetry")
public class TelemetryController {

    private final TelemetryService telemetryService;

    public TelemetryController(TelemetryService telemetryService) {
        this.telemetryService = telemetryService;
    }

    @GetMapping
    public List<Telemetry> getAllTelemetry() {
        return telemetryService.getAllTelemetry();
    }

    @GetMapping("/{id}")
    public Optional<Telemetry> getTelemetryById(@PathVariable Long id) {
        return telemetryService.getTelemetryById(id);
    }
}
