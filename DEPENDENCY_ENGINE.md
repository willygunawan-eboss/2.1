# ICHANGEBOSS ERP - Global Dependency Engine

Setiap modul di ERP bergantung pada data master di modul lain.

## Urutan Hierarki
1. Company
2. Branch
3. Department
4. Position
5. Employee
6. ... (Modul Lanjutan: CRM, Sales, Purchase)

## Implementasi
Saat User membuat Employee, sistem harus mengecek keberadaan Company, Branch, Department, Position, dan Role. Jika salah satu belum ada, sistem menampilkan pesan error ramah, bukan error DB.
