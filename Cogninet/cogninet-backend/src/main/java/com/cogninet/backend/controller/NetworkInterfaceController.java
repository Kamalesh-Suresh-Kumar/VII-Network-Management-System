package com.cogninet.backend.controller;

import com.cogninet.backend.entity.NetworkInterface;
import com.cogninet.backend.service.NetworkInterfaceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/network-interfaces")
public class NetworkInterfaceController {

    private final NetworkInterfaceService networkInterfaceService;

    public NetworkInterfaceController(NetworkInterfaceService networkInterfaceService) {
        this.networkInterfaceService = networkInterfaceService;
    }

    @GetMapping
    public List<NetworkInterface> getAllNetworkInterfaces() {
        return networkInterfaceService.getAllNetworkInterfaces();
    }

    @GetMapping("/{id}")
    public Optional<NetworkInterface> getNetworkInterfaceById(@PathVariable Long id) {
        return networkInterfaceService.getNetworkInterfaceById(id);
    }
}
