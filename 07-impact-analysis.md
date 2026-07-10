# 07 - Impact Analysis Strategy

The `ci_relationships` table enables automated Impact Analysis:

1. **Top-Down (Root Cause Analysis)**: If an ERP Business Service goes offline, engineers can trace top-down through the dependencies to find the broken component (e.g., Application -> Database -> VM -> Switch).
2. **Bottom-Up (Impact Assessment)**: If monitoring alerts that the Cisco Core Switch is down, the system can traverse bottom-up to immediately notify stakeholders that the "ERP Business Service" and "VPN Business Service" are impacted.
3. **SLA Routing**: Helpdesk tickets can automatically escalate their priority based on the Criticality of the highest-level Business Service impacted in the dependency graph.
