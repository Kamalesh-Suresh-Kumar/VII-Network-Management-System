package com.cogninet.backend.controller;

import com.cogninet.backend.entity.NetworkInterface;
import com.cogninet.backend.service.NetworkInterfaceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @PostMapping
    public ResponseEntity<NetworkInterface> createNetworkInterface(
            @RequestBody NetworkInterface networkInterface) {

        NetworkInterface createdNetworkInterface =
                networkInterfaceService.saveNetworkInterface(networkInterface);

        return new ResponseEntity<>(createdNetworkInterface, HttpStatus.CREATED);
    }

    @GetMapping
    public List<NetworkInterface> getAllNetworkInterfaces() {
        return networkInterfaceService.getAllNetworkInterfaces();
    }

    @GetMapping("/{id}")
    public Optional<NetworkInterface> getNetworkInterfaceById(@PathVariable Long id) {
        return networkInterfaceService.getNetworkInterfaceById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNetworkInterface(@PathVariable Long id) {
        networkInterfaceService.deleteNetworkInterface(id);
        return ResponseEntity.ok(
                "Network interface with id " + id + " was deleted."
        );
    }
}