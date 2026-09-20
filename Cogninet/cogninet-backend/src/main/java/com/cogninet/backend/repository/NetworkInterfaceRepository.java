package com.cogninet.backend.repository;

import com.cogninet.backend.entity.NetworkInterface;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NetworkInterfaceRepository extends JpaRepository<NetworkInterface, Long> {
}
