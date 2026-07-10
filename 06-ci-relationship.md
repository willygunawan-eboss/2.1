# 06 - CI Relationship Hierarchy

The system defines clear hierarchy structures.
For example, an ERP Stack relationship is modeled as:

1. **Business Service**: ERP Business Service
   - *Depends On* -> **Application Service**: ERP Application
   - *Depends On* -> **Database Service**: PostgreSQL Database
   - *Runs On* -> **Container**: Docker Engine
   - *Runs On* -> **Virtual Machine**: Ubuntu Server VM
   - *Runs On* -> **Hypervisor**: VMware ESXi
   - *Runs On* -> **Physical Server**: Dell PowerEdge Server (Maps to Asset)
   - *Connected To* -> **Network Switch**: Cisco Core Switch
   - *Connected To* -> **Firewall**: FortiGate Firewall
   - *Connected To* -> **Infrastructure Service**: Main ISP Link

A VPN Stack relationship is modeled as:
1. **Business Service**: VPN Business Service
   - *Depends On* -> **Router**: MikroTik CCR
   - *Depends On* -> **Infrastructure Service**: Cloudflare Tunnel
   - *Depends On* -> **Infrastructure Service**: Main ISP Link
