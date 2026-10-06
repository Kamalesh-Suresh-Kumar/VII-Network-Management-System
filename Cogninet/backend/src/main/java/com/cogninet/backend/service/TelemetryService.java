package com.cogninet.backend.service;

import com.cogninet.backend.entity.Alarm;
import com.cogninet.backend.entity.Telemetry;
import com.cogninet.backend.repository.TelemetryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TelemetryService {

    private final TelemetryRepository telemetryRepository;
    private final AlarmService alarmService;
    private final IncidentService incidentService;

    public TelemetryService(
            TelemetryRepository telemetryRepository,
            AlarmService alarmService,
            IncidentService incidentService
    ) {
        this.telemetryRepository = telemetryRepository;
        this.alarmService = alarmService;
        this.incidentService = incidentService;
    }

    public List<Telemetry> getAllTelemetry() {
        return telemetryRepository.findAll();
    }

    public Optional<Telemetry> getTelemetryById(Long id) {
        return telemetryRepository.findById(id);
    }

    public Telemetry saveTelemetry(Telemetry telemetry) {

        Telemetry savedTelemetry =
                telemetryRepository.save(telemetry);

        /*
         * Generate/update/clear alarms.
         */
        Alarm alarm =
                alarmService.processInterfaceStatusAlarm(
                        savedTelemetry
                );

        /*
         * Interface DOWN:
         * attempt correlation with peer interface.
         */
        if (alarm != null &&
                "OPEN".equals(alarm.getStatus())) {

            incidentService.processAlarm(alarm);
        }

        /*
         * Interface UP:
         * attempt incident resolution.
         */
        if (alarm != null &&
                "CLEARED".equals(alarm.getStatus())) {

            incidentService.resolveLinkIncident(alarm);
        }

        return savedTelemetry;
    }

    public void deleteTelemetry(Long id) {
        telemetryRepository.deleteById(id);
    }
}