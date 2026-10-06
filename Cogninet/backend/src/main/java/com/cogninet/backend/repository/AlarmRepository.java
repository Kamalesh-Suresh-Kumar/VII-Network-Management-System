package com.cogninet.backend.repository;

import com.cogninet.backend.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {

    Optional<Alarm> findByAlarmId(String alarmId);

    Optional<Alarm> findByAlarmIdAndStatus(
            String alarmId,
            String status
    );
}