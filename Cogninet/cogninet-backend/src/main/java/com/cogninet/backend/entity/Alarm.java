package com.cogninet.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;
import java.util.Objects;

@Entity
@Table(name = "alarms")
public class Alarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "alarm_id", nullable = false, unique = true, length = 100)
    private String alarmId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interface_id")
    private NetworkInterface networkInterface;

    @Column(name = "alarm_type", nullable = false, length = 100)
    private String alarmType;

    @Column(name = "severity", nullable = false, length = 30)
    private String severity;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "source", length = 100)
    private String source;

    @Column(name = "first_seen_at")
    private OffsetDateTime firstSeenAt;

    @Column(name = "last_seen_at")
    private OffsetDateTime lastSeenAt;

    @Column(name = "cleared_at")
    private OffsetDateTime clearedAt;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    public Alarm() {
    }

    public Alarm(String alarmId, Device device, String alarmType, String severity, String status) {
        this.alarmId = alarmId;
        this.device = device;
        this.alarmType = alarmType;
        this.severity = severity;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAlarmId() {
        return alarmId;
    }

    public void setAlarmId(String alarmId) {
        this.alarmId = alarmId;
    }

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
    }

    public NetworkInterface getNetworkInterface() {
        return networkInterface;
    }

    public void setNetworkInterface(NetworkInterface networkInterface) {
        this.networkInterface = networkInterface;
    }

    public String getAlarmType() {
        return alarmType;
    }

    public void setAlarmType(String alarmType) {
        this.alarmType = alarmType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public OffsetDateTime getFirstSeenAt() {
        return firstSeenAt;
    }

    public void setFirstSeenAt(OffsetDateTime firstSeenAt) {
        this.firstSeenAt = firstSeenAt;
    }

    public OffsetDateTime getLastSeenAt() {
        return lastSeenAt;
    }

    public void setLastSeenAt(OffsetDateTime lastSeenAt) {
        this.lastSeenAt = lastSeenAt;
    }

    public OffsetDateTime getClearedAt() {
        return clearedAt;
    }

    public void setClearedAt(OffsetDateTime clearedAt) {
        this.clearedAt = clearedAt;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Alarm alarm = (Alarm) o;
        return id != null && Objects.equals(id, alarm.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Alarm{" +
                "id=" + id +
                ", alarmId='" + alarmId + '\'' +
                ", deviceId=" + (device != null ? device.getId() : null) +
                ", interfaceId=" + (networkInterface != null ? networkInterface.getId() : null) +
                ", alarmType='" + alarmType + '\'' +
                ", severity='" + severity + '\'' +
                ", status='" + status + '\'' +
                ", source='" + source + '\'' +
                ", firstSeenAt=" + firstSeenAt +
                ", lastSeenAt=" + lastSeenAt +
                ", clearedAt=" + clearedAt +
                ", createdAt=" + createdAt +
                '}';
    }
}
