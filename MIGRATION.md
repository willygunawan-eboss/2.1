# Migration Framework

## Strategy
We utilize **Forward-Only Drizzle Migrations** generated during the CI/Build phase and executed at Node startup.

## Flow
1. Developer alters `src/db/schema.ts`
2. Developer runs `npx drizzle-kit generate`
3. SQL diffs are committed to `/drizzle/`
4. Server starts (`dist/server.cjs`)
5. The `runMigrations()` engine boots, scans `/drizzle`, and applies pending SQL updates natively to `data/erp.db`.

If migrations fail (e.g., column collisions), the backend halts immediately with `process.exit(1)`, triggering PM2 crash loops rather than serving corrupted data.
