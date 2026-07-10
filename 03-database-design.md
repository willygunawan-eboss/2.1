# 03 - Database Design

## Schema Strategy
The schema utilizes Drizzle ORM and SQLite, built for scalable graph relationships:
- **UUIDs**: All primary keys are UUIDs.
- **Soft Deletes**: `is_deleted` field on all tables.
- **Audit Trails**: Built-in tracking of `created_at` and `created_by`.

## Tables & Entities
1. **`cis`**: The core master table for Configuration Items.
2. **Metadata Tables**: `ci_categories`, `ci_environments`, `ci_statuses`.
3. **`ci_relationships`**: The crucial mapping table representing the dependency graph. Contains `parent_ci_id`, `child_ci_id`, `dependency_type`, and `impact_level`.
4. **Audit & Metadata**:
    - `ci_histories`: Logs changes to CI state.
    - `ci_documents`: Attached runbooks, topology maps, or architecture diagrams.
    - `ci_tags`: Custom tagging for reporting.
