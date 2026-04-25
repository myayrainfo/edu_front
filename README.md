# ayra-education-web

Monorepo for the AYRA education frontend with two deployable web apps in one repository:

- `apps/admin-web` for admin, finance, HR, academics, and tenant operations
- `apps/user-web` for student and teacher facing flows

## Workspace Layout

```text
ayra-education-web/
  apps/
    admin-web/
    user-web/
  packages/
    auth/
    config/
    utils/
```

The active deployment targets are the two apps inside `apps/`.

## Commands

From the repo root:

- `npm run dev:admin`
- `npm run dev:user`
- `npm run build:admin`
- `npm run build:user`

## Notes

- Shared config, auth helpers, and small utilities live in `packages/`.
- Existing admin and user feature code was moved into each app with minimal internal changes so the migration stays low-risk.
- The legacy root single-app scaffold has been removed so the repo now reflects the workspace structure directly.
