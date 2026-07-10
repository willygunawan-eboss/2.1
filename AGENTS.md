# Instruksi Khusus Proyek ERP-ichangeboss (Ubuntu Server)

Agen AI Studio **WAJIB** membaca dan mematuhi aturan ini setiap kali melakukan perubahan pada proyek ini.

## Environment & Server
- **Server Deployment**: Aplikasi ini di-deploy di Ubuntu Server lokal pengguna.
- **Port**: Aplikasi berjalan di Port `3010`. Jangan pernah menggunakan port 3000 atau 3005 (karena bentrok dengan service lain seperti Speedtest dan Kuma).
- **Proses Manager**: Aplikasi di-host menggunakan `PM2` dengan konfigurasi yang ada di `ecosystem.config.cjs`.

## Stack Teknologi
- **Frontend**: React + Vite + TailwindCSS.
- **Backend**: Express.js (menyatu dengan Vite di `server.ts` dan di-build menggunakan esbuild).
- **Database**: SQLite menggunakan `better-sqlite3` dan Drizzle ORM.
- **Lokasi Data**: File database disimpan di folder `data/erp.db` (di-ignore dari git).

## Aturan Pengembangan (Development Rules)
1. **Hindari Perubahan Port**: Selalu arahkan aplikasi untuk menggunakan variabel `process.env.PORT` yang sudah di-set ke `3010` di `ecosystem.config.cjs`.
2. **Kualitas Profesional**: Pastikan seluruh backend dan frontend terintegrasi dengan baik, jangan gunakan mock data jika tabel database sudah tersedia, dan teliti saat membuat routing UI.
3. **Mekanisme Backup**: Proyek ini memiliki shell script `backup-erp.sh` untuk melakukan kompresi data `data/` sebagai backup lokal ke folder `backups/`.
4. **Alur Deployment Pengguna**: Setiap perubahan yang diselesaikan oleh Agen, pengguna akan menekan tombol "Sync to GitHub", dan menarik pembaruannya di server mereka via SSH (`git pull`, `npm run build`, `pm2 restart`). Pastikan perintah shell yang diinstruksikan aman dan bersih (gunakan `git reset --hard` jika ada potensi konflik).
