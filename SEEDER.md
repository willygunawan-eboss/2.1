# Database Seeder Framework

## Purpose
Ensures core application configurations (Roles, Permissions, Reference Tables, Super Admin) always exist in a valid state.

## Idempotency
The seeder runs on **every server startup** but executes strictly via `UPSERT` and existence checks. It will never duplicate data.

## Automated Repairs
- **SUPER_ADMIN Rule**: The system guarantees a role named `SUPER_ADMIN` always exists and maps to all existing module permissions.
- **Admin Recovery**: If the `admin` account is deleted, the seeder re-creates it. If the `admin` account loses its mapping to `SUPER_ADMIN`, the seeder repairs the junction table.
