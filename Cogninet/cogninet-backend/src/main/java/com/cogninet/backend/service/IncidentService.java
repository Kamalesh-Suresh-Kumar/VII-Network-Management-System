package com.cogninet.backend.service;

import com.cogninet.backend.entity.Incident;
import com.cogninet.backend.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Optional<Incident> getIncidentById(Long id) {
        return incidentRepository.findById(id);
    }

    public Incident saveIncident(Incident incident) {
        return incidentRepository.save(incident);
    }

    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }
}
