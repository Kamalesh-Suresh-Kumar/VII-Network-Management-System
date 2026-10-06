package com.cogninet.backend.controller;

import com.cogninet.backend.entity.Incident;
import com.cogninet.backend.service.IncidentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(
            IncidentService incidentService
    ) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public List<Incident> getAllIncidents() {
        return incidentService.getAllIncidents();
    }

    @GetMapping("/{id}")
    public Optional<Incident> getIncidentById(
            @PathVariable Long id
    ) {
        return incidentService.getIncidentById(id);
    }
}