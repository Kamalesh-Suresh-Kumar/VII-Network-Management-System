import asyncio
from datetime import datetime, timezone

import requests

from pysnmp.hlapi.v3arch.asyncio import (
    SnmpEngine,
    CommunityData,
    UdpTransportTarget,
    ContextData,
    ObjectType,
    ObjectIdentity,
    walk_cmd,
)


SNMP_PORT = 161
COMMUNITY = "cogninet"

BACKEND_URL = "http://localhost:8080/api/telemetry"

# ---------------------------------------------------------
# Device configuration
# ---------------------------------------------------------

DEVICES = {
    "R1": {
        "ip": "192.168.122.12",
        "device_id": 3,
        "interfaces": {
            "eth0": 2,
            "eth1": 9,
            "eth2": 10,
        },
    },
    "R2": {
        "ip": "10.0.12.2",
        "device_id": 4,
        "interfaces": {
            "eth0": 5,
            "eth1": 6,
        },
    },
    "R3": {
        "ip": "10.0.13.2",
        "device_id": 5,
        "interfaces": {
            "eth0": 7,
            "eth1": 8,
        },
    },
}


# ---------------------------------------------------------
# SNMP OIDs
# ---------------------------------------------------------

IF_DESCR_OID = "1.3.6.1.2.1.2.2.1.2"
IF_OPER_STATUS_OID = "1.3.6.1.2.1.2.2.1.8"


async def collect_interface_status(device_name, device_config):
    """
    Collect interface operational status for one router.

    SNMP mapping:
        ifIndex -> ifDescr -> backend interface ID
    """

    snmp_engine = SnmpEngine()

    device_ip = device_config["ip"]

    interface_names = {}
    results = []

    print()
    print("=" * 60)
    print(f"Collecting telemetry from {device_name}")
    print(f"SNMP target: {device_ip}")
    print("=" * 60)

    # -----------------------------------------------------
    # Step 1: Discover interface names
    # -----------------------------------------------------

    async for (
            error_indication,
            error_status,
            error_index,
            var_binds,
    ) in walk_cmd(
        snmp_engine,
        CommunityData(COMMUNITY, mpModel=1),
        await UdpTransportTarget.create(
            (device_ip, SNMP_PORT),
            timeout=2,
            retries=1,
        ),
        ContextData(),
        ObjectType(ObjectIdentity(IF_DESCR_OID)),
    ):

        if error_indication:
            raise RuntimeError(
                f"{device_name}: {error_indication}"
            )

        if error_status:
            raise RuntimeError(
                f"{device_name}: "
                f"{error_status.prettyPrint()} "
                f"at index {error_index}"
            )

        for var_bind in var_binds:
            oid, value = var_bind

            oid_text = str(oid)

            if not oid_text.startswith(IF_DESCR_OID + "."):
                break

            if_index = int(
                oid_text.rsplit(".", 1)[-1]
            )

            interface_names[if_index] = str(value)

    print("Discovered interfaces:")

    for if_index, interface_name in interface_names.items():
        print(
            f"  ifIndex={if_index} "
            f"interface={interface_name}"
        )

    # -----------------------------------------------------
    # Step 2: Collect operational status
    # -----------------------------------------------------

    async for (
            error_indication,
            error_status,
            error_index,
            var_binds,
    ) in walk_cmd(
        snmp_engine,
        CommunityData(COMMUNITY, mpModel=1),
        await UdpTransportTarget.create(
            (device_ip, SNMP_PORT),
            timeout=2,
            retries=1,
        ),
        ContextData(),
        ObjectType(ObjectIdentity(IF_OPER_STATUS_OID)),
    ):

        if error_indication:
            raise RuntimeError(
                f"{device_name}: {error_indication}"
            )

        if error_status:
            raise RuntimeError(
                f"{device_name}: "
                f"{error_status.prettyPrint()} "
                f"at index {error_index}"
            )

        for var_bind in var_binds:

            oid, value = var_bind

            oid_text = str(oid)

            if not oid_text.startswith(
                    IF_OPER_STATUS_OID + "."
            ):
                break

            if_index = int(
                oid_text.rsplit(".", 1)[-1]
            )

            interface_name = interface_names.get(
                if_index
            )

            results.append(
                {
                    "deviceName": device_name,
                    "ifIndex": if_index,
                    "interfaceName": interface_name,
                    "metricName": "interface_oper_status",
                    "metricValue": 1 if int(value) == 1 else 0,
                    "unit": "status",
                    "source": "SNMP",
                }
            )

    return results


def send_to_backend(result, device_config):

    interface_name = result["interfaceName"]

    interface_map = device_config["interfaces"]

    interface_id = interface_map.get(
        interface_name
    )

    if interface_id is None:

        print(
            f"Skipping "
            f"{result['deviceName']} "
            f"ifIndex={result['ifIndex']} "
            f"interface={interface_name}: "
            f"no backend interface mapping"
        )

        return

    timestamp = datetime.now(
        timezone.utc
    ).isoformat()

    payload = {
        "device": {
            "id": device_config["device_id"]
        },
        "networkInterface": {
            "id": interface_id
        },
        "metricName": result["metricName"],
        "metricValue": result["metricValue"],
        "unit": result["unit"],
        "source": result["source"],
        "timestamp": timestamp,
    }

    response = requests.post(
        BACKEND_URL,
        json=payload,
        timeout=5,
    )

    response.raise_for_status()

    print(
        f"Sent telemetry: "
        f"device={result['deviceName']} "
        f"ifIndex={result['ifIndex']} "
        f"interface={interface_name} "
        f"interfaceId={interface_id} "
        f"value={result['metricValue']} "
        f"timestamp={timestamp} "
        f"HTTP={response.status_code}"
    )


async def collect_device(
        device_name,
        device_config,
):

    try:

        results = await collect_interface_status(
            device_name,
            device_config,
        )

        print(
            f"{device_name}: "
            f"collected {len(results)} "
            f"SNMP interface metrics"
        )

        for result in results:

            print(result)

            send_to_backend(
                result,
                device_config,
            )

    except Exception as error:

        print(
            f"ERROR collecting "
            f"{device_name}: {error}"
        )


async def main():

    while True:

        print()
        print("=" * 60)
        print("COGINET MULTI-DEVICE SNMP COLLECTOR")
        print("=" * 60)

        for device_name, device_config in DEVICES.items():

            await collect_device(
                device_name,
                device_config,
            )

        print()
        print("=" * 60)
        print("SNMP collection completed")
        print("=" * 60)

        print()
        print("Next SNMP collection in 10 seconds...")
        await asyncio.sleep(10)


if __name__ == "__main__":

    asyncio.run(main())