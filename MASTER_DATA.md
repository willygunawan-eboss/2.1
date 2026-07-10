# ICHANGEBOSS ERP - Master Data Validation

Setiap proses CUD (Create, Update, Delete) pada tabel transaksional dan master lanjutan memiliki Validation Layer yang mencegat sebelum query ke database.

## Praktik Terbaik
Tampilkan pesan ramah: "Silakan lengkapi Master Department terlebih dahulu di menu Organization."
Jangan biarkan user menerima pesan error 500 SQLite Constraint.
