package com.cogninet.backend.controller;

import com.cogninet.backend.entity.TopologyLink;
import com.cogninet.backend.service.TopologyLinkService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/topology-links")
public class TopologyLinkController {

    private final TopologyLinkService topologyLinkService;

    public TopologyLinkController(
            TopologyLinkService topologyLinkService
    ) {
        this.topologyLinkService = topologyLinkService;
    }

    @GetMapping
    public List<TopologyLink> getAllLinks() {
        return topologyLinkService.getAllLinks();
    }

    @GetMapping("/{id}")
    public Optional<TopologyLink> getLinkById(
            @PathVariable Long id
    ) {
        return topologyLinkService.getLinkById(id);
    }

    @PostMapping
    public ResponseEntity<TopologyLink> createLink(
            @RequestParam Long sourceDeviceId,
            @RequestParam Long sourceInterfaceId,
            @RequestParam Long targetDeviceId,
            @RequestParam Long targetInterfaceId,
            @RequestParam String linkType,
            @RequestParam String status,
            @RequestParam(required = false) Double bandwidthMbps
    ) {

        TopologyLink link =
                topologyLinkService.createLink(
                        sourceDeviceId,
                        sourceInterfaceId,
                        targetDeviceId,
                        targetInterfaceId,
                        linkType,
                        status,
                        bandwidthMbps
                );

        return new ResponseEntity<>(
                link,
                HttpStatus.CREATED
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLink(
            @PathVariable Long id
    ) {
        topologyLinkService.deleteLink(id);

        return ResponseEntity.noContent().build();
    }
}