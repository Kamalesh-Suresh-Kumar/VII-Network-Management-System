# Cogninet Backend

> Network Management System & AIOps Backend built with Spring Boot 4, Java 21, and Supabase PostgreSQL.

---

## 📖 Complete Documentation

The complete architectural, API, schema, and operational documentation is available in:

👉 **[BACKEND_DOCUMENTATION.md](file:///d:/nsm/cogninet-backend/cogninet-backend/BACKEND_DOCUMENTATION.md)**

---

## 🚀 Quick Start

### 1. Start Dev Server
```powershell
.\mvnw.cmd spring-boot:run
```
The application will boot on `http://localhost:8080`.

### 2. Run Tests
```powershell
.\mvnw.cmd test
```

---

## 📡 Key Endpoints

| Resource | Base URL | Supported Methods |
| :--- | :--- | :--- |
| **Devices** | `/api/devices` | `GET`, `POST`, `PUT`, `DELETE` |
| **Network Interfaces** | `/api/network-interfaces` | `GET` |
| **Telemetry** | `/api/telemetry` | `GET` |
| **Alarms** | `/api/alarms` | `GET` |
| **Incidents** | `/api/incidents` | `GET` |
| **Topology** | `/api/topology` | `GET` |

See [BACKEND_DOCUMENTATION.md](file:///d:/nsm/cogninet-backend/cogninet-backend/BACKEND_DOCUMENTATION.md) for full endpoint schemas and testing instructions.
