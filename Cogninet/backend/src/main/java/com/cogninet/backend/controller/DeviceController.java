package com.cogninet.backend.controller;

import com.cogninet.backend.entity.Device;
import com.cogninet.backend.service.DeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @PostMapping
    public ResponseEntity<Device> createDevice(@RequestBody Device device) {
        Device createdDevice = deviceService.saveDevice(device);
        return new ResponseEntity<>(createdDevice, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Device> getAllDevices() {
        return deviceService.getAllDevices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable Long id) {
        return deviceService.getDeviceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Device> updateDevice(@PathVariable Long id, @RequestBody Device device) {
        return deviceService.updateDevice(id, device)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDevice(@PathVariable Long id) {
        boolean deleted = deviceService.deleteDevice(id);
        if (deleted) {
            return ResponseEntity.ok("Device with id " + id + " was successfully deleted.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Device with id " + id + " not found.");
        }
    }
}
