package com.cogninet.backend.service;

import com.cogninet.backend.entity.Alarm;
import com.cogninet.backend.entity.Device;
import com.cogninet.backend.entity.NetworkInterface;
import com.cogninet.backend.entity.Telemetry;
import com.cogninet.backend.repository.AlarmRepository;
import com.cogninet.backend.repository.DeviceRepository;
import com.cogninet.backend.repository.NetworkInterfaceRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AlarmService {

    private final AlarmRepository alarmRepository;
    private final DeviceRepository deviceRepository;
    private final NetworkInterfaceRepository networkInterfaceRepository;

    public AlarmService(
            AlarmRepository alarmRepository,
            DeviceRepository deviceRepository,
            NetworkInterfaceRepository networkInterfaceRepository
    ) {
        this.alarmRepository = alarmRepository;
        this.deviceRepository = deviceRepository;
        this.networkInterfaceRepository = networkInterfaceRepository;
    }

    public List<Alarm> getAllAlarms() {
        return alarmRepository.findAll();
    }

    public Optional<Alarm> getAlarmById(Long id) {
        return alarmRepository.findById(id);
    }

    public Alarm saveAlarm(Alarm alarm) {
        return alarmRepository.save(alarm);
    }

    public void deleteAlarm(Long id) {
        alarmRepository.deleteById(id);
    }

    public Optional<Alarm> findByAlarmId(String alarmId) {
        return alarmRepository.findByAlarmId(alarmId);
    }

    public Optional<Alarm> findActiveAlarm(String alarmId) {
        return alarmRepository.findByAlarmIdAndStatus(
                alarmId,
                "OPEN"
        );
    }

    /**
     * Process interface operational status telemetry.
     *
     * value = 0 -> interface DOWN -> open/update alarm
     * value = 1 -> interface UP   -> clear active alarm
     */
    public Alarm processInterfaceStatusAlarm(Telemetry telemetry) {

        if (telemetry == null) {
            return null;
        }

        if (telemetry.getDevice() == null) {
            return null;
        }

        if (telemetry.getNetworkInterface() == null) {
            return null;
        }

        if (!"interface_oper_status".equals(
                telemetry.getMetricName()
        )) {
            return null;
        }

        Long deviceId = telemetry.getDevice().getId();

        Long interfaceId =
                telemetry.getNetworkInterface().getId();

        /*
         * Load the real persisted entities.
         *
         * The telemetry API request only contains IDs, so the
         * request-side Device/NetworkInterface objects may not
         * contain hostname/interfaceName.
         */
        Optional<Device> deviceResult =
                deviceRepository.findById(deviceId);

        Optional<NetworkInterface> interfaceResult =
                networkInterfaceRepository.findById(interfaceId);

        if (deviceResult.isEmpty() || interfaceResult.isEmpty()) {
            return null;
        }

        Device device = deviceResult.get();
        NetworkInterface networkInterface = interfaceResult.get();

        String interfaceName =
                networkInterface.getInterfaceName();

        String hostname =
                device.getHostname();

        String alarmId =
                "IF-DOWN-" + deviceId + "-" + interfaceId;

        double status = telemetry.getMetricValue();

        /*
         * ============================================================
         * INTERFACE DOWN
         * ============================================================
         */
        if (status == 0) {

            Optional<Alarm> existing =
                    alarmRepository.findByAlarmId(alarmId);

            if (existing.isPresent()) {

                Alarm alarm = existing.get();

                /*
                 * Alarm already OPEN.
                 * Do not create another alarm.
                 */
                if ("OPEN".equals(alarm.getStatus())) {

                    alarm.setLastSeenAt(
                            telemetry.getTimestamp()
                    );

                    return alarmRepository.save(alarm);
                }

                /*
                 * Alarm was previously CLEARED.
                 * Reopen the same alarm record.
                 */
                alarm.setStatus("OPEN");
                alarm.setSeverity("CRITICAL");
                alarm.setAlarmType("INTERFACE_DOWN");

                alarm.setDevice(device);
                alarm.setNetworkInterface(networkInterface);

                alarm.setMessage(
                        "Interface " +
                                interfaceName +
                                " on device " +
                                hostname +
                                " is DOWN"
                );

                alarm.setSource(
                        telemetry.getSource()
                );

                alarm.setFirstSeenAt(
                        telemetry.getTimestamp()
                );

                alarm.setLastSeenAt(
                        telemetry.getTimestamp()
                );

                alarm.setClearedAt(null);

                return alarmRepository.save(alarm);
            }

            /*
             * No previous alarm exists.
             * Create a new alarm.
             */
            Alarm alarm = new Alarm();

            alarm.setAlarmId(alarmId);

            alarm.setDevice(device);
            alarm.setNetworkInterface(networkInterface);

            alarm.setAlarmType("INTERFACE_DOWN");

            alarm.setSeverity("CRITICAL");

            alarm.setStatus("OPEN");

            alarm.setMessage(
                    "Interface " +
                            interfaceName +
                            " on device " +
                            hostname +
                            " is DOWN"
            );

            alarm.setSource(
                    telemetry.getSource()
            );

            alarm.setFirstSeenAt(
                    telemetry.getTimestamp()
            );

            alarm.setLastSeenAt(
                    telemetry.getTimestamp()
            );

            alarm.setCreatedAt(
                    OffsetDateTime.now()
            );

            return alarmRepository.save(alarm);
        }

        /*
         * ============================================================
         * INTERFACE UP
         * ============================================================
         */
        if (status == 1) {

            Optional<Alarm> existing =
                    alarmRepository.findByAlarmIdAndStatus(
                            alarmId,
                            "OPEN"
                    );

            if (existing.isPresent()) {

                Alarm alarm = existing.get();

                alarm.setStatus("CLEARED");

                alarm.setClearedAt(
                        telemetry.getTimestamp()
                );

                alarm.setLastSeenAt(
                        telemetry.getTimestamp()
                );

                return alarmRepository.save(alarm);
            }
        }

        return null;
    }
}