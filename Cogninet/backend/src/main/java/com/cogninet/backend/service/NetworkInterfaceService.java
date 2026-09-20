package com.cogninet.backend.service;

import com.cogninet.backend.entity.NetworkInterface;
import com.cogninet.backend.repository.NetworkInterfaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NetworkInterfaceService {

    private final NetworkInterfaceRepository networkInterfaceRepository;

    public NetworkInterfaceService(NetworkInterfaceRepository networkInterfaceRepository) {
        this.networkInterfaceRepository = networkInterfaceRepository;
    }

    public List<NetworkInterface> getAllNetworkInterfaces() {
        return networkInterfaceRepository.findAll();
    }

    public Optional<NetworkInterface> getNetworkInterfaceById(Long id) {
        return networkInterfaceRepository.findById(id);
    }

    public NetworkInterface saveNetworkInterface(NetworkInterface networkInterface) {
        return networkInterfaceRepository.save(networkInterface);
    }

    public void deleteNetworkInterface(Long id) {
        networkInterfaceRepository.deleteById(id);
    }
}
