# 01 - Business Domain (Enterprise Configuration Management Database - CMDB)

## Overview
The Enterprise CMDB Domain manages Configuration Items (CIs). Unlike an Asset, which is primarily a physical or financial record (like a piece of hardware with a warranty and depreciation schedule), a CI represents a functional node within the IT ecosystem that provides a business or technical service.

## Core Concepts
1. **Configuration Item (CI)**: Any component that needs to be managed in order to deliver an IT Service. CIs include Business Services (ERP, VPN, Mail), Applications, Databases, Virtual Machines, Containers, and Infrastructure Services (ISP).
2. **Relationships & Dependencies**: CIs do not exist in isolation. They are connected in a Dependency Graph (e.g., Application depends on Database, Database runs on Virtual Machine).
3. **Cross-Domain Linkage**: 
    - **Customer**: A CI can be mapped to the Customer who uses it.
    - **Asset**: A CI can be mapped to an Asset (e.g., the CI "Dell PowerEdge Server" corresponds to the Asset record where warranty and financials are tracked).
    - **Contract & Project**: CIs can belong to a Service Contract or be part of a Project delivery.
4. **Comprehensive CI Profile**: CIs track attributes such as Environment (Production, Staging), Criticality (High, Medium, Low), Ownership (Business Owner, Technical Owner), and Monitoring Profiles.
