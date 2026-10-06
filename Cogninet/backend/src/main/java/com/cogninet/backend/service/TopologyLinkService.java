package com.cogninet.backend.service;

import com.cogninet.backend.entity.Device;
import com.cogninet.backend.entity.NetworkInterface;
import com.cogninet.backend.entity.TopologyLink;
import com.cogninet.backend.repository.DeviceRepository;
import com.cogninet.backend.repository.NetworkInterfaceRepository;
import com.cogninet.backend.repository.TopologyLinkRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TopologyLinkService {

    private final TopologyLinkRepository topologyLinkRepository;
    private final DeviceRepository deviceRepository;
    private final NetworkInterfaceRepository networkInterfaceRepository;

    public TopologyLinkService(
            TopologyLinkRepository topologyLinkRepository,
            DeviceRepository deviceRepository,
            NetworkInterfaceRepository networkInterfaceRepository
    ) {
        this.topologyLinkRepository = topologyLinkRepository;
        this.deviceRepository = deviceRepository;
        this.networkInterfaceRepository = networkInterfaceRepository;
    }

    public List<TopologyLink> getAllLinks() {
        return topologyLinkRepository.findAll();
    }

    public Optional<TopologyLink> getLinkById(Long id) {
        return topologyLinkRepository.findById(id);
    }

    public TopologyLink createLink(
            Long sourceDeviceId,
            Long sourceInterfaceId,
            Long targetDeviceId,
            Long targetInterfaceId,
            String linkType,
            String status,
            Double bandwidthMbps
    ) {

        Device sourceDevice =
                deviceRepository.findById(sourceDeviceId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Source device not found: " +
                                                sourceDeviceId
                                )
                        );

        Device targetDevice =
                deviceRepository.findById(targetDeviceId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Target device not found: " +
                                                targetDeviceId
                                )
                        );

        NetworkInterface sourceInterface =
                networkInterfaceRepository.findById(sourceInterfaceId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Source interface not found: " +
                                                sourceInterfaceId
                                )
                        );

        NetworkInterface targetInterface =
                networkInterfaceRepository.findById(targetInterfaceId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Target interface not found: " +
                                                targetInterfaceId
                                )
                        );

        TopologyLink link = new TopologyLink();

        link.setSourceDevice(sourceDevice);
        link.setSourceInterface(sourceInterface);

        link.setTargetDevice(targetDevice);
        link.setTargetInterface(targetInterface);

        link.setLinkType(linkType);
        link.setStatus(status);
        link.setBandwidthMbps(bandwidthMbps);

        OffsetDateTime now = OffsetDateTime.now();

        link.setCreatedAt(now);
        link.setUpdatedAt(now);

        return topologyLinkRepository.save(link);
    }

    public void deleteLink(Long id) {
        topologyLinkRepository.deleteById(id);
    }
}