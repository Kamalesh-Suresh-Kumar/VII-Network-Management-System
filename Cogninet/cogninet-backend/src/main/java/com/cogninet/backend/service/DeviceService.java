package com.cogninet.backend.service;

import com.cogninet.backend.entity.Device;
import com.cogninet.backend.repository.DeviceRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;

    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    public Device saveDevice(Device device) {
        device.setId(null);
        if (device.getCreatedAt() == null) {
            device.setCreatedAt(OffsetDateTime.now());
        }
        if (device.getUpdatedAt() == null) {
            device.setUpdatedAt(OffsetDateTime.now());
        }
        return deviceRepository.save(device);
    }

    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    public Optional<Device> getDeviceById(Long id) {
        return deviceRepository.findById(id);
    }

    public Optional<Device> updateDevice(Long id, Device deviceDetails) {
        return deviceRepository.findById(id).map(existingDevice -> {
            existingDevice.setDeviceId(deviceDetails.getDeviceId());
            existingDevice.setName(deviceDetails.getName());
            existingDevice.setHostname(deviceDetails.getHostname());
            existingDevice.setIpAddress(deviceDetails.getIpAddress());
            existingDevice.setDeviceType(deviceDetails.getDeviceType());
            existingDevice.setVendor(deviceDetails.getVendor());
            existingDevice.setModel(deviceDetails.getModel());
            existingDevice.setOsVersion(deviceDetails.getOsVersion());
            existingDevice.setStatus(deviceDetails.getStatus());
            existingDevice.setDescription(deviceDetails.getDescription());
            existingDevice.setUpdatedAt(OffsetDateTime.now());
            return deviceRepository.save(existingDevice);
        });
    }

    public boolean deleteDevice(Long id) {
        if (deviceRepository.existsById(id)) {
            deviceRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
