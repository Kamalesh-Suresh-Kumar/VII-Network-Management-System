package com.cogninet.backend.controller;

import com.cogninet.backend.entity.Alarm;
import com.cogninet.backend.service.AlarmService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/alarms")
public class AlarmController {

    private final AlarmService alarmService;

    public AlarmController(AlarmService alarmService) {
        this.alarmService = alarmService;
    }

    @GetMapping
    public List<Alarm> getAllAlarms() {
        return alarmService.getAllAlarms();
    }

    @GetMapping("/{id}")
    public Optional<Alarm> getAlarmById(@PathVariable Long id) {
        return alarmService.getAlarmById(id);
    }

    @PostMapping
    public ResponseEntity<Alarm> createAlarm(@RequestBody Alarm alarm) {
        Alarm createdAlarm = alarmService.saveAlarm(alarm);
        return new ResponseEntity<>(createdAlarm, HttpStatus.CREATED);
    }
}