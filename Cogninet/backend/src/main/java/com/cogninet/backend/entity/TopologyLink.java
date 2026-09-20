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
@Table(name = "topology_links")
public class TopologyLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_device_id", nullable = false)
    private Device sourceDevice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_interface_id")
    private NetworkInterface sourceInterface;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_device_id", nullable = false)
    private Device targetDevice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_interface_id")
    private NetworkInterface targetInterface;

    @Column(name = "link_type", length = 50)
    private String linkType;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "bandwidth_mbps")
    private Double bandwidthMbps;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public TopologyLink() {
    }

    public TopologyLink(Device sourceDevice, Device targetDevice) {
        this.sourceDevice = sourceDevice;
        this.targetDevice = targetDevice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Device getSourceDevice() {
        return sourceDevice;
    }

    public void setSourceDevice(Device sourceDevice) {
        this.sourceDevice = sourceDevice;
    }

    public NetworkInterface getSourceInterface() {
        return sourceInterface;
    }

    public void setSourceInterface(NetworkInterface sourceInterface) {
        this.sourceInterface = sourceInterface;
    }

    public Device getTargetDevice() {
        return targetDevice;
    }

    public void setTargetDevice(Device targetDevice) {
        this.targetDevice = targetDevice;
    }

    public NetworkInterface getTargetInterface() {
        return targetInterface;
    }

    public void setTargetInterface(NetworkInterface targetInterface) {
        this.targetInterface = targetInterface;
    }

    public String getLinkType() {
        return linkType;
    }

    public void setLinkType(String linkType) {
        this.linkType = linkType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getBandwidthMbps() {
        return bandwidthMbps;
    }

    public void setBandwidthMbps(Double bandwidthMbps) {
        this.bandwidthMbps = bandwidthMbps;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TopologyLink that = (TopologyLink) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "TopologyLink{" +
                "id=" + id +
                ", sourceDeviceId=" + (sourceDevice != null ? sourceDevice.getId() : null) +
                ", sourceInterfaceId=" + (sourceInterface != null ? sourceInterface.getId() : null) +
                ", targetDeviceId=" + (targetDevice != null ? targetDevice.getId() : null) +
                ", targetInterfaceId=" + (targetInterface != null ? targetInterface.getId() : null) +
                ", linkType='" + linkType + '\'' +
                ", status='" + status + '\'' +
                ", bandwidthMbps=" + bandwidthMbps +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
