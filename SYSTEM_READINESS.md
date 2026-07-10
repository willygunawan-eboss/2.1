# ICHANGEBOSS ERP - System Readiness

Mengecek kelengkapan data master utama sebelum ERP beroperasi di Production Mode.

## Kriteria
- Organization: Company, Branch, Department minimal 1.
- HR: Position, Employee minimal 1.
- RBAC: Role (Admin/dll) minimal 1.
- Reference: Reference Group / Data minimal 1.

## API Endpoint
`GET /api/system/health` mengembalikan `systemReady` (boolean) beserta rincian modul yang `OK` atau `PENDING`.
