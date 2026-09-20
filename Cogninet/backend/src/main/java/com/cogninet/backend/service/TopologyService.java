package com.cogninet.backend.service;

import com.cogninet.backend.entity.TopologyLink;
import com.cogninet.backend.repository.TopologyLinkRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TopologyService {

    private final TopologyLinkRepository topologyLinkRepository;

    public TopologyService(TopologyLinkRepository topologyLinkRepository) {
        this.topologyLinkRepository = topologyLinkRepository;
    }

    public List<TopologyLink> getAllTopologyLinks() {
        return topologyLinkRepository.findAll();
    }

    public Optional<TopologyLink> getTopologyLinkById(Long id) {
        return topologyLinkRepository.findById(id);
    }

    public TopologyLink saveTopologyLink(TopologyLink topologyLink) {
        return topologyLinkRepository.save(topologyLink);
    }

    public void deleteTopologyLink(Long id) {
        topologyLinkRepository.deleteById(id);
    }
}
