# 05 - API Skeleton Plan

## Base Route: `/api/cmdb`

### Implemented
- **GET `/cis`**: Fetch CIs with pagination, searching by `ciCode` or `name`, filtering by `customerId` and `ciType`.
- **GET `/cis/:id`**: Deep-fetch a single CI, including its Category, Environment, Status, linked Customer/Asset, and the full graph of `parentRelationships` and `childRelationships`.
- **POST `/cis`**: Basic CI creation endpoint.
- **GET `/relationships`**: Fetches all CI relationship mappings for global topology graphing.

### Planned for Future Sprints
- **PUT `/cis/:id`**: Update core CI attributes.
- **DELETE `/cis/:id`**: Soft delete a CI.
- **POST `/cis/:id/relationships`**: Attach a new Parent or Child CI.
- **GET `/cis/:id/impact`**: Perform a recursive traversal to list all downstream Business Services impacted if this CI fails.
