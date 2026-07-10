# Environment Specification

## Server Runtime
- **OS**: Ubuntu Server
- **Process Manager**: PM2
- **Port**: 3010 (Strictly enforced to avoid port collisions with Kuma/Speedtest)
- **Node Version**: v18+

## File Layout
- **Source**: `/src` (React/Vite Frontend + Express Backend)
- **Distribution**: `/dist` (Compiled assets, `server.cjs`, and frontend HTML)
- **Data Storage**: `/data/erp.db` (Persistent SQLite DB)

## Variables (`.env`)
```ini
# Core Configuration
DATABASE_URL=file:./data/erp.db
PORT=3010
NODE_ENV=production
```
