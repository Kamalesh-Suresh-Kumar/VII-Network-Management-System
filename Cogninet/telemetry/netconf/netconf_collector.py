from ncclient import manager


DEVICES = {
    "R1": {
        "host": "192.168.122.12",
        "port": 830,
    },
    "R2": {
        "host": "10.0.12.2",
        "port": 830,
    },
    "R3": {
        "host": "10.0.13.2",
        "port": 830,
    },
}


def collect_device_state(device_name, config):
    print()
    print("=" * 60)
    print(f"NETCONF device: {device_name}")
    print(f"Target: {config['host']}:{config['port']}")
    print("=" * 60)

    with manager.connect(
            host=config["host"],
            port=config["port"],
            username="cogninet",
            password="cogninet",
            hostkey_verify=False,
            allow_agent=False,
            look_for_keys=False,
            timeout=5,
    ) as session:

        print("NETCONF session established")
        print("Server capabilities:")
        for capability in session.server_capabilities:
            print(f"  {capability}")

        reply = session.get(
            filter=("subtree", """
                <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">
                </interfaces>
            """)
        )

        print()
        print("NETCONF <get> response:")
        print(reply.xml)


def main():
    print()
    print("=" * 60)
    print("COGINET NETCONF COLLECTOR")
    print("=" * 60)

    for device_name, config in DEVICES.items():
        try:
            collect_device_state(device_name, config)
        except Exception as error:
            print(f"{device_name}: NETCONF unavailable: {error}")


if __name__ == "__main__":
    main()