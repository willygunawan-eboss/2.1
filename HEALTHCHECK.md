# Health Check Endpoint

**Endpoint**: `GET /api/system/health`

## Purpose
Validates the overall integrity of the ERP node after deployment.

## Response Structure
```json
{
  "success": true,
  "data": {
    "applicationVersion": "1.0.0",
    "buildTime": "2026-07-10T12:00:00.000Z",
    "databasePath": "data/erp.db",
    "status": {
      "database": "OK",
      "rbac": "OK",
      "reference": "OK",
      "organization": "OK"
    },
    "systemReady": true
  }
}
```
