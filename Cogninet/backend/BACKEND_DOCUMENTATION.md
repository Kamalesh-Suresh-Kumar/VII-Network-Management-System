# Cogninet Backend - Technical Documentation & System Design

## 1. Overview & Architecture

**Cogninet Backend** is a high-performance Network Management and AIOps backend service built with **Spring Boot 4** and **Java 21**, backed by **Supabase PostgreSQL**. It models network devices, network interfaces, real-time telemetry metrics, network alarms, detected incidents, and topology interconnections.

### Architectural Diagram

```
[ Clients / Postman / Frontend ]
               │
               ▼ HTTP / REST (JSON)
┌────────────────────────────────────────────────┐
│ Controller Layer                               │
│ - DeviceController                             │
│ - NetworkInterfaceController                   │
│ - TelemetryController                          │
│ - AlarmController                              │
│ - IncidentController                           │
│ - TopologyController                           │
└───────────────────────┬────────────────────────┘
                        │
                        ▼ Dependency Injection
┌────────────────────────────────────────────────┐
│ Service Layer                                  │
│ - DeviceService                                │
│ - NetworkInterfaceService                      │
│ - TelemetryService                             │
│ - AlarmService                                 │
│ - IncidentService                              │
│ - TopologyService                              │
└───────────────────────┬────────────────────────┘
                        │
                        ▼ Spring Data JPA
┌────────────────────────────────────────────────┐
│ Repository Layer                               │
│ - DeviceRepository                             │
│ - NetworkInterfaceRepository                   │
│ - TelemetryRepository                          │
│ - AlarmRepository                              │
│ - IncidentRepository                           │
│ - TopologyLinkRepository                       │
└───────────────────────┬────────────────────────┘
                        │
                        ▼ Hibernate ORM 7
┌────────────────────────────────────────────────┐
│ Supabase PostgreSQL 17 Database                │
│ - devices                                      │
│ - network_interfaces                           │
│ - telemetry                                    │
│ - alarms                                       │
│ - incidents                                    │
│ - topology_links                               │
└────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Component / Technology | Version |
| :--- | :--- | :--- |
| **Runtime** | Java Development Kit (JDK) | 21 / 27 |
| **Framework** | Spring Boot | 4.0.8 |
| **Persistence** | Spring Data JPA / Hibernate ORM | 7.2.24.Final |
| **Database** | PostgreSQL (Supabase Cloud) | 17.6 |
| **Connection Pool** | HikariCP | Default Spring Boot Starter |
| **Build Tool** | Apache Maven Wrapper | 3.9.16 |

---

## 3. Package Structure

All Java source code is organized under `com.cogninet.backend`:

```text
src/main/java/com/cogninet/backend/
├── CogninetBackendApplication.java       # Spring Boot main entrypoint
│
├── entity/                               # JPA Entities (Jakarta Persistence)
│   ├── Device.java                       # Table: devices
│   ├── NetworkInterface.java             # Table: network_interfaces
│   ├── Telemetry.java                    # Table: telemetry
│   ├── Alarm.java                        # Table: alarms
│   ├── Incident.java                     # Table: incidents
│   └── TopologyLink.java                 # Table: topology_links
│
├── repository/                           # Spring Data Repositories
│   ├── DeviceRepository.java
│   ├── NetworkInterfaceRepository.java
│   ├── TelemetryRepository.java
│   ├── AlarmRepository.java
│   ├── IncidentRepository.java
│   └── TopologyLinkRepository.java
│
├── service/                              # Business Logic & CRUD services
│   ├── DeviceService.java
│   ├── NetworkInterfaceService.java
│   ├── TelemetryService.java
│   ├── AlarmService.java
│   ├── IncidentService.java
│   └── TopologyService.java
│
└── controller/                           # REST API Controllers
    ├── DeviceController.java             # /api/devices
    ├── NetworkInterfaceController.java   # /api/network-interfaces
    ├── TelemetryController.java          # /api/telemetry
    ├── AlarmController.java              # /api/alarms
    ├── IncidentController.java           # /api/incidents
    └── TopologyController.java           # /api/topology
```

---

## 4. Database Schema & JPA Entity Mappings

### Type Mapping Standards

| PostgreSQL Column Type | Java Attribute Type | JPA / Hibernate Annotations |
| :--- | :--- | :--- |
| `BIGINT PRIMARY KEY` | `Long` | `@Id @GeneratedValue(strategy = GenerationType.IDENTITY)` |
| `VARCHAR(n)` | `String` | `@Column(length = n)` |
| `TEXT` | `String` | `@Column(columnDefinition = "TEXT")` |
| `DOUBLE PRECISION` | `Double` | `@Column` |
| `TIMESTAMPTZ` | `OffsetDateTime` | `@Column(name = "...")` |
| `INET` | `String` | `@Column(columnDefinition = "inet") @ColumnTransformer(write = "?::inet")` |
| `FOREIGN KEY` | Entity Reference | `@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "...")` |

---

### Entity Specifications

#### 1. `devices` &rarr; `Device.java`
Models routers, switches, servers, firewalls, and other managed network assets.

- **Columns & Mappings**:
  - `id` (`BIGINT PRIMARY KEY`) &rarr; `Long id`
  - `device_id` (`VARCHAR(100) NOT NULL UNIQUE`) &rarr; `String deviceId`
  - `name` (`VARCHAR(150) NOT NULL`) &rarr; `String name`
  - `hostname` (`VARCHAR(150)`) &rarr; `String hostname`
  - `ip_address` (`INET`) &rarr; `String ipAddress` (with `?::inet` write cast)
  - `device_type` (`VARCHAR(50)`) &rarr; `String deviceType`
  - `vendor` (`VARCHAR(100)`) &rarr; `String vendor`
  - `model` (`VARCHAR(100)`) &rarr; `String model`
  - `os_version` (`VARCHAR(100)`) &rarr; `String osVersion`
  - `status` (`VARCHAR(30)`) &rarr; `String status`
  - `description` (`TEXT`) &rarr; `String description`
  - `created_at` (`TIMESTAMPTZ`) &rarr; `OffsetDateTime createdAt`
  - `updated_at` (`TIMESTAMPTZ`) &rarr; `OffsetDateTime updatedAt`
- **Relationships**:
  - `@OneToMany(mappedBy = "device", fetch = FetchType.LAZY)` &rarr; `List<NetworkInterface> networkInterfaces`

#### 2. `network_interfaces` &rarr; `NetworkInterface.java`
Models physical or logical ports/interfaces attached to devices.

- **Columns & Mappings**:
  - `id` (`BIGINT PRIMARY KEY`) &rarr; `Long id`
  - `device_id` (`BIGINT NOT NULL`) &rarr; `@ManyToOne Device device` (`@JoinColumn(name = "device_id")`)
  - `interface_name` (`VARCHAR(100) NOT NULL`) &rarr; `String interfaceName`
  - `ip_address` (`INET`) &rarr; `String ipAddress` (with `?::inet` write cast)
  - `mac_address` (`VARCHAR(50)`) &rarr; `String macAddress`
  - `status` (`VARCHAR(30)`) &rarr; `String status`
  - `speed` (`BIGINT`) &rarr; `Long speed`
  - `description` (`TEXT`) &rarr; `String description`
  - `created_at` (`TIMESTAMPTZ`) &rarr; `OffsetDateTime createdAt`
  - `updated_at` (`TIMESTAMPTZ`) &rarr; `OffsetDateTime updatedAt`

#### 3. `telemetry` &rarr; `Telemetry.java`
Time-series metric data points collected from devices or interfaces.

- **Columns & Mappings**:
  - `id` (`BIGINT PRIMARY KEY`) &rarr; `Long id`
  - `device_id` (`BIGINT NOT NULL`) &rarr; `@ManyToOne Device device`
  - `interface_id` (`BIGINT`) &rarr; `@ManyToOne NetworkInterface networkInterface` (nullable)
  - `metric_name` (`VARCHAR(100) NOT NULL`) &rarr; `String metricName`
  - `metric_value` (`DOUBLE PRECISION NOT NULL`) &rarr; `Double metricValue`
  - `unit` (`VARCHAR(30)`) &rarr; `String unit`
  - `source` (`VARCHAR(100)`) &rarr; `String source`
  - `timestamp` (`TIMESTAMPTZ NOT NULL`) &rarr; `OffsetDateTime timestamp`

#### 4. `alarms` &rarr; `Alarm.java`
Active or historical network alerts and threshold breaches.

- **Columns & Mappings**:
  - `id` (`BIGINT PRIMARY KEY`) &rarr; `Long id`
  - `alarm_id` (`VARCHAR(100) NOT NULL UNIQUE`) &rarr; `String alarmId`
  - `device_id` (`BIGINT NOT NULL`) &rarr; `@ManyToOne Device device`
  - `interface_id` (`BIGINT`) &rarr; `@ManyToOne NetworkInterface networkInterface` (nullable)
  - `alarm_type` (`VARCHAR(100) NOT NULL`) &rarr; `String alarmType`
  - `severity` (`VARCHAR(30) NOT NULL`) &rarr; `String severity`
  - `status` (`VARCHAR(30) NOT NULL`) &rarr; `String status`
  - `message` (`TEXT`) &rarr; `String message`
  - `source` (`VARCHAR(100)`) &rarr; `String source`
  - `first_seen_at` (`TIMESTAMPTZ`) &rarr; `OffsetDateTime firstSeenAt`
  - `last_seen_at` (`TIMESTAMPTZ`) &rarr; `OffsetDateTime lastSeenAt`
  - `cleared_at` (`TIMESTAMPTZ`) &rarr; `OffsetDateTime clearedAt`
  - `created_at` (`TIMESTAMPTZ`) &rarr; `OffsetDateTime createdAt`

#### 5. `incidents` &rarr; `Incident.java`
Root-cause incidents derived from alarms or anomaly detection.

- **Columns & Mappings**:
  - `id` (`BIGINT PRIMARY KEY`) &rarr; `Long id`
  - `incident_id` (`VARCHAR(100) NOT NULL UNIQUE`) &rarr; `String incidentId`
  - `title` (`VARCHAR(200) NOT NULL`) &rarr; `String title`
  - `severity` (`VARCHAR(30) NOT NULL`) &rarr; `String severity`
  - `status` (`VARCHAR(30) NOT NULL`) &rarr; `String status`
  - `root_cause` (`TEXT`) &rarr; `String rootCause`
  - `confidence` (`DOUBLE PRECISION`) &rarr; `Double confidence`
  - `description` (`TEXT`) &rarr; `String description`
  - `started_at` (`TIMESTAMPTZ`) &rarr; `OffsetDateTime startedAt`
  - `resolved_at` (`TIMESTAMPTZ`) &rarr; `OffsetDateTime resolvedAt`
  - `created_at` (`TIMESTAMPTZ`) &rarr; `OffsetDateTime createdAt`
  - `updated_at` (`TIMESTAMPTZ`) &rarr; `OffsetDateTime updatedAt`

#### 6. `topology_links` &rarr; `TopologyLink.java`
Represents physical/logical links connecting two devices and interfaces.

- **Columns & Mappings**:
  - `id` (`BIGINT PRIMARY KEY`) &rarr; `Long id`
  - `source_device_id` (`BIGINT NOT NULL`) &rarr; `@ManyToOne Device sourceDevice` (`@JoinColumn(name = "source_device_id")`)
  - `source_interface_id` (`BIGINT`) &rarr; `@ManyToOne NetworkInterface sourceInterface` (`@JoinColumn(name = "source_interface_id")`)
  - `target_device_id` (`BIGINT NOT NULL`) &rarr; `@ManyToOne Device targetDevice` (`@JoinColumn(name = "target_device_id")`)
  - `target_interface_id` (`BIGINT`) &rarr; `@ManyToOne NetworkInterface targetInterface` (`@JoinColumn(name = "target_interface_id")`)
  - `link_type` (`VARCHAR(50)`) &rarr; `String linkType`
  - `status` (`VARCHAR(30)`) &rarr; `String status`
  - `bandwidth_mbps` (`DOUBLE PRECISION`) &rarr; `Double bandwidthMbps`
  - `created_at` (`TIMESTAMPTZ`) &rarr; `OffsetDateTime createdAt`
  - `updated_at` (`TIMESTAMPTZ`) &rarr; `OffsetDateTime updatedAt`

---

## 5. Complete REST API Reference

### Devices API (`/api/devices`)

| Method | Endpoint | Description | Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/devices` | Create a new device | Device JSON | `201 Created` with saved Device |
| `GET` | `/api/devices` | Get all devices | None | `200 OK` with Device array |
| `GET` | `/api/devices/{id}` | Get device by ID | None | `200 OK` (or `404 Not Found`) |
| `PUT` | `/api/devices/{id}` | Update existing device | Updated Device JSON | `200 OK` (or `404 Not Found`) |
| `DELETE` | `/api/devices/{id}` | Delete device by ID | None | `200 OK` (or `404 Not Found`) |

#### Device Request Example (POST/PUT):
```json
{
  "deviceId": "R1-CORE-NYC",
  "name": "Core Router NYC",
  "hostname": "nyc-core-r1.net",
  "ipAddress": "10.0.0.1",
  "deviceType": "ROUTER",
  "vendor": "Cisco",
  "model": "ASR-9000",
  "osVersion": "IOS-XR 7.5.2",
  "status": "UP",
  "description": "Primary backbone router for NYC DC"
}
```

---

### Network Interfaces API (`/api/network-interfaces`)

| Method | Endpoint | Description | Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/network-interfaces` | List all network interfaces | `200 OK` with JSON array |
| `GET` | `/api/network-interfaces/{id}` | Get single interface by ID | `200 OK` (or `404 Not Found`) |

---

### Telemetry API (`/api/telemetry`)

| Method | Endpoint | Description | Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/telemetry` | List all telemetry data points | `200 OK` with JSON array |
| `GET` | `/api/telemetry/{id}` | Get telemetry data point by ID | `200 OK` (or `404 Not Found`) |

---

### Alarms API (`/api/alarms`)

| Method | Endpoint | Description | Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/alarms` | List all network alarms | `200 OK` with JSON array |
| `GET` | `/api/alarms/{id}` | Get alarm by ID | `200 OK` (or `404 Not Found`) |

---

### Incidents API (`/api/incidents`)

| Method | Endpoint | Description | Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/incidents` | List all incidents | `200 OK` with JSON array |
| `GET` | `/api/incidents/{id}` | Get incident by ID | `200 OK` (or `404 Not Found`) |

---

### Topology API (`/api/topology`)

| Method | Endpoint | Description | Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/topology` | List all topology links | `200 OK` with JSON array |
| `GET` | `/api/topology/{id}` | Get topology link by ID | `200 OK` (or `404 Not Found`) |

---

## 6. How to Run and Test Locally

### 1. Start the Application
Open a terminal in the project directory and run:
```powershell
.\mvnw.cmd spring-boot:run
```

The server will start on port `8080`:
```text
Tomcat started on port 8080 (http) with context path '/'
Started CogninetBackendApplication in 7.8 seconds
```

### 2. Run Automated Integration & Unit Tests
```powershell
.\mvnw.cmd test
```
Runs test cases verifying Spring context startup and database communication across all 6 tables.

### 3. Test Device CRUD via cURL / PowerShell

```powershell
# 1. Create a Device
curl.exe -X POST http://localhost:8080/api/devices `
  -H "Content-Type: application/json" `
  -d '{"deviceId":"TEST-R1","name":"Test Router","hostname":"test-router","ipAddress":"192.168.100.10","deviceType":"ROUTER","vendor":"Cisco","model":"TEST-1000","osVersion":"Test OS","status":"UP","description":"Verification device"}'

# 2. Read All Devices
curl.exe -X GET http://localhost:8080/api/devices

# 3. Read Device with ID 1
curl.exe -X GET http://localhost:8080/api/devices/1

# 4. Update Device with ID 1
curl.exe -X PUT http://localhost:8080/api/devices/1 `
  -H "Content-Type: application/json" `
  -d '{"deviceId":"TEST-R1","name":"Updated Router","hostname":"updated-router","ipAddress":"192.168.100.20","deviceType":"ROUTER","vendor":"Cisco","model":"TEST-2000","osVersion":"Updated OS","status":"DOWN","description":"Updated description"}'

# 5. Delete Device with ID 1
curl.exe -X DELETE http://localhost:8080/api/devices/1
```

---

## 7. Key Design Decisions & Best Practices

1. **PostgreSQL `INET` Handling**:
   PostgreSQL `inet` columns strictly enforce valid IP formatting and reject plain `VARCHAR` binding without a cast. We mapped `ipAddress` as Java `String` with `@ColumnTransformer(write = "?::inet")` so strings sent from REST requests are automatically cast to PostgreSQL `inet` without needing fragile custom JDBC types.

2. **Timezone Preservation with `OffsetDateTime`**:
   All database `TIMESTAMPTZ` columns are mapped to Java `OffsetDateTime`. This ensures timestamps retain exact UTC offset values and eliminates date shifting issues across servers in different timezones.

3. **Safe Entity Methods (`toString()`, `equals()`, `hashCode()`)**:
   Entities do not traverse lazy-loaded relationship objects inside `toString()`, `equals()`, or `hashCode()`. This prevents infinite recursion (`StackOverflowError`) and avoids premature queries outside active database transactions (`LazyInitializationException`).

4. **Layered Separation of Concerns**:
   - Controllers handle HTTP routing, status codes, and input extraction.
   - Services implement business rules and timestamp defaulting.
   - Repositories provide clean abstraction over SQL queries via Spring Data JPA.
   - Configuration and database schemas remain unmanaged by Hibernate (`ddl-auto` is disabled), preserving external Supabase schema authority.
