# Cogninet GNS3 Docker Routers

The GNS3 topology uses three custom FRRouting Docker images:

- `cogninet-r1:1.1`
- `cogninet-r2:1.1`
- `cogninet-r3:1.1`

Base image:

- `quay.io/frrouting/frr:10.7.1`

The base image installs:

- FRRouting
- Net-SNMP
- Net-SNMP tools
- iptables

The startup script configures router addressing, OSPF, SNMP, and R1 NAT/forwarding according to `ROUTER_ROLE`.

The currently working images are preserved as-is. These files document the build configuration; they do not modify the running GNS3 project.
