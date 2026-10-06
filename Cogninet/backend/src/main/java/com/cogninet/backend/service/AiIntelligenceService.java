package com.cogninet.backend.service;

import com.cogninet.backend.entity.Telemetry;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiIntelligenceService {

    private final TelemetryService telemetryService;

    public AiIntelligenceService(TelemetryService telemetryService) {
        this.telemetryService = telemetryService;
    }

    public Map<String, Object> analyze() {

        List<Telemetry> telemetry = telemetryService.getAllTelemetry();

        Map<String, Object> result = new LinkedHashMap<>();

        result.put("engine", "COGINET AI Fault Intelligence");
        result.put("model", "Explainable Statistical Anomaly Detector");
        result.put("analysisTimestamp", OffsetDateTime.now().toString());
        result.put("telemetrySamples", telemetry.size());

        List<Map<String, Object>> findings = new ArrayList<>();

        /*
         * Group interface operational-status telemetry by
         * device/interface combination.
         */
        Map<String, List<Telemetry>> groups =
                telemetry.stream()
                        .filter(t -> "interface_oper_status".equals(t.getMetricName()))
                        .filter(t -> t.getNetworkInterface() != null)
                        .collect(Collectors.groupingBy(
                                t -> t.getDevice().getId()
                                        + "-"
                                        + t.getNetworkInterface().getId()
                        ));

        for (Map.Entry<String, List<Telemetry>> entry : groups.entrySet()) {

            List<Telemetry> samples = entry.getValue();

            samples.sort(
                    Comparator.comparing(
                            Telemetry::getTimestamp,
                            Comparator.nullsLast(Comparator.naturalOrder())
                    )
            );

            if (samples.isEmpty()) {
                continue;
            }

            Telemetry latest = samples.get(samples.size() - 1);

            double latestValue = latest.getMetricValue();

            long downCount =
                    samples.stream()
                            .filter(t -> t.getMetricValue() != null
                                    && t.getMetricValue() == 0.0)
                            .count();

            /*
             * SNMP ifOperStatus:
             * 1 = up
             * 2 = down
             */
            boolean down = latestValue == 0.0;

            double score;

            if (down) {
                score = 0.97;
            } else if (downCount > 0) {
                score = 0.70;
            } else {
                score = 0.05;
            }

            String severity;

            if (score >= 0.90) {
                severity = "CRITICAL";
            } else if (score >= 0.60) {
                severity = "WARNING";
            } else {
                severity = "NORMAL";
            }

            Map<String, Object> finding = new LinkedHashMap<>();

            finding.put("deviceId", latest.getDevice().getId());
            finding.put("interfaceId", latest.getNetworkInterface().getId());
            finding.put("metric", latest.getMetricName());
            finding.put("latestValue", latestValue);
            finding.put("sampleCount", samples.size());
            finding.put("downSamples", downCount);
            finding.put("anomaly", score >= 0.60);
            finding.put("anomalyScore", score);
            finding.put("severity", severity);

            List<String> evidence = new ArrayList<>();

            if (down) {
                evidence.add(
                        "Interface operational state is DOWN"
                );
            }

            if (downCount > 0) {
                evidence.add(
                        "Historical telemetry contains interface-down observations"
                );
            }

            if (!down && downCount == 0) {
                evidence.add(
                        "Interface operational state is stable"
                );
            }

            finding.put("evidence", evidence);

            String rootCause;

            if (down) {
                rootCause = "Possible physical/link or interface failure";
            } else if (downCount > 0) {
                rootCause = "Possible intermittent interface instability";
            } else {
                rootCause = "No abnormal interface condition detected";
            }

            finding.put("predictedRootCause", rootCause);

            findings.add(finding);
        }

        /*
         * Highest anomaly first.
         */
        findings.sort(
                Comparator.comparing(
                        f -> (Double) f.get("anomalyScore"),
                        Comparator.reverseOrder()
                )
        );

        long anomalies =
                findings.stream()
                        .filter(f -> Boolean.TRUE.equals(f.get("anomaly")))
                        .count();

        result.put("anomalousInterfaces", anomalies);
        result.put("healthyInterfaces", findings.size() - anomalies);
        result.put("findings", findings);

        /*
         * Overall system intelligence.
         */
        if (anomalies > 0) {
            result.put(
                    "overallStatus",
                    "FAULT_DETECTED"
            );
            result.put(
                    "summary",
                    anomalies
                            + " interface anomaly/anomalies detected from telemetry"
            );
        } else {
            result.put(
                    "overallStatus",
                    "NORMAL"
            );
            result.put(
                    "summary",
                    "No significant interface anomalies detected"
            );
        }

        return result;
    }
}
