#!/bin/bash
echo "Memperbaiki database yang corrupt (malformed)..."
rm -f data/erp.db data/erp.db-shm data/erp.db-wal
echo "Menjalankan migrasi database baru..."
npx drizzle-kit push
echo "Selesai! Silakan restart PM2 Anda dengan: pm2 restart ecosystem.config.cjs"
