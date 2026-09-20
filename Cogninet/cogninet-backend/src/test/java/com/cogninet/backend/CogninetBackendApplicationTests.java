package com.cogninet.backend;

import com.cogninet.backend.repository.AlarmRepository;
import com.cogninet.backend.repository.DeviceRepository;
import com.cogninet.backend.repository.IncidentRepository;
import com.cogninet.backend.repository.NetworkInterfaceRepository;
import com.cogninet.backend.repository.TelemetryRepository;
import com.cogninet.backend.repository.TopologyLinkRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CogninetBackendApplicationTests {

	@Autowired
	private DeviceRepository deviceRepository;

	@Autowired
	private NetworkInterfaceRepository networkInterfaceRepository;

	@Autowired
	private TelemetryRepository telemetryRepository;

	@Autowired
	private AlarmRepository alarmRepository;

	@Autowired
	private IncidentRepository incidentRepository;

	@Autowired
	private TopologyLinkRepository topologyLinkRepository;

	@Test
	void contextLoads() {
	}

	@Test
	void testAllSixTablesConnected() {
		assertDoesNotThrow(() -> {
			long devicesCount = deviceRepository.count();
			long interfacesCount = networkInterfaceRepository.count();
			long telemetryCount = telemetryRepository.count();
			long alarmsCount = alarmRepository.count();
			long incidentsCount = incidentRepository.count();
			long topologyCount = topologyLinkRepository.count();

			System.out.println("=================================================");
			System.out.println(">>> 1. devices table count: " + devicesCount);
			System.out.println(">>> 2. network_interfaces table count: " + interfacesCount);
			System.out.println(">>> 3. telemetry table count: " + telemetryCount);
			System.out.println(">>> 4. alarms table count: " + alarmsCount);
			System.out.println(">>> 5. incidents table count: " + incidentsCount);
			System.out.println(">>> 6. topology_links table count: " + topologyCount);
			System.out.println("=================================================");
		});
	}

}


