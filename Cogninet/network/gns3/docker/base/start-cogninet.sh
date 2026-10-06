#!/bin/sh

echo "=== Cogninet Router Startup ==="

mkdir -p /etc/snmp

cat > /etc/snmp/snmpd.conf <<SNMPEOF
agentAddress udp:0.0.0.0:161
rocommunity cogninet 0.0.0.0/0
sysLocation "Cogninet GNS3 Lab"
sysContact "Cogninet NMS"
SNMPEOF

touch /etc/frr/vtysh.conf
chown frr:frrvty /etc/frr/vtysh.conf
chmod 660 /etc/frr/vtysh.conf

if [ "$ROUTER_ROLE" = "R1" ]; then
    echo "Role: R1"

    ip addr add 10.0.12.1/30 dev eth0 2>/dev/null || true
    ip addr add 10.0.13.1/30 dev eth1 2>/dev/null || true

    udhcpc -i eth2 -q || true

    echo 1 > /proc/sys/net/ipv4/ip_forward

    iptables -t nat -C POSTROUTING -o eth2 -j MASQUERADE 2>/dev/null ||
    iptables -t nat -A POSTROUTING -o eth2 -j MASQUERADE

elif [ "$ROUTER_ROLE" = "R2" ]; then
    echo "Role: R2"

    ip addr add 10.0.12.2/30 dev eth0 2>/dev/null || true
    ip addr add 10.0.23.2/30 dev eth1 2>/dev/null || true

    ip route replace default via 10.0.12.1 dev eth0

elif [ "$ROUTER_ROLE" = "R3" ]; then
    echo "Role: R3"

    ip addr add 10.0.13.2/30 dev eth0 2>/dev/null || true
    ip addr add 10.0.23.1/30 dev eth1 2>/dev/null || true

    ip route replace default via 10.0.13.1 dev eth0
fi

/usr/lib/frr/docker-start &
FRR_PID=$!

sleep 3

if [ "$ROUTER_ROLE" = "R1" ]; then

    vtysh -c "configure terminal" \
      -c "hostname R1" \
      -c "interface eth0" \
      -c "ip address 10.0.12.1/30" \
      -c "interface eth1" \
      -c "ip address 10.0.13.1/30" \
      -c "router ospf" \
      -c "network 10.0.12.0/30 area 0" \
      -c "network 10.0.13.0/30 area 0"

elif [ "$ROUTER_ROLE" = "R2" ]; then

    vtysh -c "configure terminal" \
      -c "hostname R2" \
      -c "interface eth0" \
      -c "ip address 10.0.12.2/30" \
      -c "interface eth1" \
      -c "ip address 10.0.23.2/30" \
      -c "router ospf" \
      -c "network 10.0.12.0/30 area 0" \
      -c "network 10.0.23.0/30 area 0"

elif [ "$ROUTER_ROLE" = "R3" ]; then

    vtysh -c "configure terminal" \
      -c "hostname R3" \
      -c "interface eth0" \
      -c "ip address 10.0.13.2/30" \
      -c "interface eth1" \
      -c "ip address 10.0.23.1/30" \
      -c "router ospf" \
      -c "network 10.0.13.0/30 area 0" \
      -c "network 10.0.23.0/30 area 0"
fi

snmpd -f -Lo >/tmp/snmpd.log 2>&1 &

wait "$FRR_PID"
