# 02 - Business Rules

## Configuration Items vs Assets
- **Asset vs CI**: An Asset represents the financial and lifecycle aspect (procurement, warranty, disposal). A CI represents the operational, service-delivery aspect.
- **Mapping**: One Asset can map to many CIs (e.g., A single physical ESXi Server Asset can host multiple Virtual Machine CIs).
- **Not all CIs are Assets**: A Business Service, an Application, or a Cloud Resource (like a DNS record) are CIs, but they are not necessarily financial Assets.

## Dependencies & Relationships
- **Multi-Parent & Multi-Child**: One CI can have multiple Parents (e.g., multiple Applications depend on the same Database) and multiple Children (e.g., a Database depends on multiple Virtual Machines or storage LUNs).
- **Relationship Directions**: The relationships must specify direction (Parent-to-Child) and type (e.g., "Runs On", "Depends On", "Connected To").
- **Impact Analysis**: Monitoring and Helpdesk operations must traverse this dependency graph. If a Core Switch goes down, the system should instantly know which ESXi hosts, VMs, Databases, and ultimately which Business Services are impacted.

## Operational Ownership
- **Roles**: Every critical CI must clearly specify a Business Owner (accountable for the service) and a Technical Owner (responsible for the system).
- **Support Groups**: A CI must point to a specific Department or Support Group for escalation routing.
