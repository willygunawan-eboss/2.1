# Database Architecture

## Persistence
The application uses a unified, single-file database to prevent drift:
- **Active Path**: `data/erp.db`
- **Fallback**: Can be overridden via `DATABASE_URL` environment variable.
- **WAL Mode**: Write-Ahead Logging is enforced via SQLite PRAGMA at runtime for safe concurrent PM2 access.
- **Git Ignore**: The `data/` folder is explicitly excluded from version control to protect production state.

## Drift Prevention
The system actively halts on startup if multiple database fragments are detected or if the Drizzle schema fails migration compatibility.
