package com.cogninet.backend.service;

import com.cogninet.backend.entity.Alarm;
import com.cogninet.backend.entity.Incident;
import com.cogninet.backend.entity.TopologyLink;
import com.cogninet.backend.repository.AlarmRepository;
import com.cogninet.backend.repository.IncidentRepository;
import com.cogninet.backend.repository.TopologyLinkRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final TopologyLinkRepository topologyLinkRepository;
    private final AlarmRepository alarmRepository;

    public IncidentService(
            IncidentRepository incidentRepository,
            TopologyLinkRepository topologyLinkRepository,
            AlarmRepository alarmRepository
    ) {
        this.incidentRepository = incidentRepository;
        this.topologyLinkRepository = topologyLinkRepository;
        this.alarmRepository = alarmRepository;
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

    /**
     * Correlates an interface alarm with the network topology.
     *
     * When both endpoints of a physical topology link are DOWN,
     * the two alarms are correlated into one LINK_FAILURE incident.
     */
    public Incident processAlarm(Alarm alarm) {

        if (alarm == null) {
            return null;
        }

        if (!"INTERFACE_DOWN".equals(alarm.getAlarmType())) {
            return null;
        }

        if (alarm.getNetworkInterface() == null) {
            return null;
        }

        Long interfaceId =
                alarm.getNetworkInterface().getId();

        Long deviceId =
                alarm.getDevice().getId();

        /*
         * Find the topology link containing this interface.
         */
        Optional<TopologyLink> topologyLink =
                topologyLinkRepository.findAll()
                        .stream()
                        .filter(link ->
                                (
                                        link.getSourceInterface() != null
                                                && interfaceId.equals(
                                                link.getSourceInterface().getId()
                                        )
                                )
                                        ||
                                        (
                                                link.getTargetInterface() != null
                                                        && interfaceId.equals(
                                                        link.getTargetInterface().getId()
                                                )
                                        )
                        )
                        .findFirst();

        if (topologyLink.isEmpty()) {
            return null;
        }

        TopologyLink link = topologyLink.get();

        Long sourceDeviceId =
                link.getSourceDevice().getId();

        Long targetDeviceId =
                link.getTargetDevice().getId();

        Long sourceInterfaceId =
                link.getSourceInterface() != null
                        ? link.getSourceInterface().getId()
                        : null;

        Long targetInterfaceId =
                link.getTargetInterface() != null
                        ? link.getTargetInterface().getId()
                        : null;

        if (sourceInterfaceId == null || targetInterfaceId == null) {
            return null;
        }

        /*
         * Determine the opposite endpoint.
         */
        Long peerInterfaceId;

        if (interfaceId.equals(sourceInterfaceId)) {
            peerInterfaceId = targetInterfaceId;
        } else {
            peerInterfaceId = sourceInterfaceId;
        }

        /*
         * Find the active alarm on the peer interface.
         */
        String peerAlarmId;

        if (interfaceId.equals(sourceInterfaceId)) {

            peerAlarmId =
                    "IF-DOWN-" +
                            targetDeviceId +
                            "-" +
                            targetInterfaceId;

        } else {

            peerAlarmId =
                    "IF-DOWN-" +
                            sourceDeviceId +
                            "-" +
                            sourceInterfaceId;
        }

        Optional<Alarm> peerAlarm =
                alarmRepository.findByAlarmIdAndStatus(
                        peerAlarmId,
                        "OPEN"
                );

        /*
         * Only create a LINK_FAILURE incident when
         * both endpoints are confirmed DOWN.
         */
        if (peerAlarm.isEmpty()) {
            return null;
        }

        /*
         * Use stable ordering so the incident ID does not
         * depend on which endpoint generated the alarm first.
         */
        long lowerDevice =
                Math.min(sourceDeviceId, targetDeviceId);

        long higherDevice =
                Math.max(sourceDeviceId, targetDeviceId);

        String incidentId =
                "LINK-DOWN-" +
                        lowerDevice +
                        "-" +
                        higherDevice;

        /*
         * Existing active incident?
         * Do not create duplicates.
         */
        Optional<Incident> existing =
                incidentRepository.findByIncidentIdAndStatus(
                        incidentId,
                        "OPEN"
                );

        if (existing.isPresent()) {

            Incident incident = existing.get();

            incident.setUpdatedAt(
                    OffsetDateTime.now()
            );

            return incidentRepository.save(incident);
        }

        String sourceHostname =
                link.getSourceDevice().getHostname();

        String targetHostname =
                link.getTargetDevice().getHostname();

        String sourceInterfaceName =
                link.getSourceInterface().getInterfaceName();

        String targetInterfaceName =
                link.getTargetInterface().getInterfaceName();

        Incident incident = new Incident();

        incident.setIncidentId(incidentId);

        incident.setTitle(
                "Network link failure: " +
                        sourceHostname +
                        " ↔ " +
                        targetHostname
        );

        incident.setSeverity("CRITICAL");

        incident.setStatus("OPEN");

        incident.setRootCause(
                "Physical network link failure between " +
                        sourceHostname +
                        " " +
                        sourceInterfaceName +
                        " and " +
                        targetHostname +
                        " " +
                        targetInterfaceName
        );

        incident.setConfidence(0.95);

        incident.setDescription(
                "Correlated interface-down alarms detected " +
                        "on both endpoints of topology link " +
                        sourceHostname +
                        " " +
                        sourceInterfaceName +
                        " ↔ " +
                        targetHostname +
                        " " +
                        targetInterfaceName +
                        "."
        );

        incident.setStartedAt(
                alarm.getFirstSeenAt()
        );

        incident.setCreatedAt(
                OffsetDateTime.now()
        );

        incident.setUpdatedAt(
                OffsetDateTime.now()
        );

        return incidentRepository.save(incident);
    }

    /**
     * Resolve a link-failure incident when both
     * endpoint alarms have cleared.
     */
    public Incident resolveLinkIncident(Alarm clearedAlarm) {

        if (clearedAlarm == null) {
            return null;
        }

        if (!"INTERFACE_DOWN".equals(
                clearedAlarm.getAlarmType()
        )) {
            return null;
        }

        if (!"CLEARED".equals(
                clearedAlarm.getStatus()
        )) {
            return null;
        }

        if (clearedAlarm.getNetworkInterface() == null) {
            return null;
        }

        Long interfaceId =
                clearedAlarm.getNetworkInterface().getId();

        Optional<TopologyLink> topologyLink =
                topologyLinkRepository.findAll()
                        .stream()
                        .filter(link ->
                                (
                                        link.getSourceInterface() != null
                                                && interfaceId.equals(
                                                link.getSourceInterface().getId()
                                        )
                                )
                                        ||
                                        (
                                                link.getTargetInterface() != null
                                                        && interfaceId.equals(
                                                        link.getTargetInterface().getId()
                                                )
                                        )
                        )
                        .findFirst();

        if (topologyLink.isEmpty()) {
            return null;
        }

        TopologyLink link = topologyLink.get();

        Long sourceDeviceId =
                link.getSourceDevice().getId();

        Long targetDeviceId =
                link.getTargetDevice().getId();

        String incidentId =
                "LINK-DOWN-" +
                        Math.min(sourceDeviceId, targetDeviceId) +
                        "-" +
                        Math.max(sourceDeviceId, targetDeviceId);

        Optional<Incident> incidentOptional =
                incidentRepository.findByIncidentIdAndStatus(
                        incidentId,
                        "OPEN"
                );

        if (incidentOptional.isEmpty()) {
            return null;
        }

        /*
         * Check whether the opposite endpoint is
         * still reporting an active DOWN alarm.
         */
        Long sourceInterfaceId =
                link.getSourceInterface().getId();

        Long targetInterfaceId =
                link.getTargetInterface().getId();

        String sourceAlarmId =
                "IF-DOWN-" +
                        sourceDeviceId +
                        "-" +
                        sourceInterfaceId;

        String targetAlarmId =
                "IF-DOWN-" +
                        targetDeviceId +
                        "-" +
                        targetInterfaceId;

        boolean sourceStillDown =
                alarmRepository
                        .findByAlarmIdAndStatus(
                                sourceAlarmId,
                                "OPEN"
                        )
                        .isPresent();

        boolean targetStillDown =
                alarmRepository
                        .findByAlarmIdAndStatus(
                                targetAlarmId,
                                "OPEN"
                        )
                        .isPresent();

        /*
         * Resolve only when BOTH endpoints are recovered.
         */
        if (sourceStillDown || targetStillDown) {
            return null;
        }

        Incident incident =
                incidentOptional.get();

        incident.setStatus("RESOLVED");

        incident.setResolvedAt(
                clearedAlarm.getClearedAt()
        );

        incident.setUpdatedAt(
                OffsetDateTime.now()
        );

        return incidentRepository.save(incident);
    }
}