# ICHANGEBOSS ERP Deployment Guide

## Overview
This repository serves as the Single Source of Truth for the ERP. 
Deployments are completely automated to prevent environment drift. No manual configuration changes should be made directly on the Ubuntu Server.

## How to Deploy
Run the standardized deployment script on your Ubuntu server:
```bash
./deploy.sh
```

### Deployment Steps (Automated)
1. **Source Sync**: `git pull origin main` fetches the latest verified code.
2. **Dependencies**: `npm install` ensures package synchronization.
3. **Build Phase**: `npm run build` compiles Vite (frontend) and esbuild (backend server).
4. **Service Restart**: `pm2 restart ecosystem.config.cjs` safely cycles the server.
5. **Runtime Migrations**: Triggered automatically on Node startup. Validates schema and performs `drizzle-orm` migrations.
6. **Runtime Seeding**: Triggered automatically on Node startup. Validates Master data, Reference data, and RBAC mapping.
7. **Health Check**: `deploy.sh` pauses and queries `/api/system/health` to confirm the application successfully bound to port 3010 and the database is active.
