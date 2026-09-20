package com.cogninet.backend.controller;

import com.cogninet.backend.entity.TopologyLink;
import com.cogninet.backend.service.TopologyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/topology")
public class TopologyController {

    private final TopologyService topologyService;

    public TopologyController(TopologyService topologyService) {
        this.topologyService = topologyService;
    }

    @GetMapping
    public List<TopologyLink> getAllTopologyLinks() {
        return topologyService.getAllTopologyLinks();
    }

    @GetMapping("/{id}")
    public Optional<TopologyLink> getTopologyLinkById(@PathVariable Long id) {
        return topologyService.getTopologyLinkById(id);
    }
}
