FROM quay.io/frrouting/frr:10.7.1

RUN apk update && \
    apk add --no-cache net-snmp net-snmp-tools iptables

RUN touch /etc/frr/vtysh.conf && \
    chown frr:frrvty /etc/frr/vtysh.conf && \
    chmod 660 /etc/frr/vtysh.conf

RUN sed -i 's/^ospfd=no/ospfd=yes/' /etc/frr/daemons

COPY start-cogninet.sh /usr/local/bin/start-cogninet.sh
RUN chmod +x /usr/local/bin/start-cogninet.sh

CMD ["/usr/local/bin/start-cogninet.sh"]
