# 07 - Asset Lifecycle

1. **Procurement**: Asset is ordered. Record created in `assets` with Status: "Procured". Purchase Date is logged.
2. **Staging & Configuration**: Asset arrives. `asset_configurations` and `asset_networks` are populated. Status: "In Staging".
3. **Deployment (Commissioning)**: Asset is deployed to a Branch or Customer. `commissionDate` is set. Status: "Active".
4. **Operations & Support**: 
   - Asset generates alerts in `asset_monitorings`.
   - End-users open Tickets linked to the Asset.
   - Engineers log `asset_maintenances`.
5. **Renewal**: `asset_licenses` or `asset_warranties` hit expiration warnings. System flags for renewal.
6. **Decommissioning**: Asset reaches `endOfLife` or fails permanently. 
7. **Disposal**: Record created in `asset_disposals` with the method (e.g., e-Waste, Sold, Returned to Vendor). Asset Status becomes "Disposed". Soft delete (`is_deleted = true`) may be applied depending on audit retention rules.
