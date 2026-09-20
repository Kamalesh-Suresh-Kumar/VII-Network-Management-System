package com.cogninet.backend.service;

import com.cogninet.backend.entity.Alarm;
import com.cogninet.backend.repository.AlarmRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlarmService {

    private final AlarmRepository alarmRepository;

    public AlarmService(AlarmRepository alarmRepository) {
        this.alarmRepository = alarmRepository;
    }

    public List<Alarm> getAllAlarms() {
        return alarmRepository.findAll();
    }

    public Optional<Alarm> getAlarmById(Long id) {
        return alarmRepository.findById(id);
    }

    public Alarm saveAlarm(Alarm alarm) {
        return alarmRepository.save(alarm);
    }

    public void deleteAlarm(Long id) {
        alarmRepository.deleteById(id);
    }
}
