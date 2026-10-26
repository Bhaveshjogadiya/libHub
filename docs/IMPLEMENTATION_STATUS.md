# LibHub implementation status

This archive is a runnable college-project foundation, not a security-audited production release. Do not present unimplemented modules as complete.

## Implemented in this version

- React + Vite frontend with Tailwind CSS, responsive library workspace, login/register, dashboard, catalog, book/member management, loans/returns, reservations, fines, and reports views.
- Express REST API with MongoDB/Mongoose models for users, books, categories, loans, reservations, fines, and audit logs.
- HTTP-only cookie authentication, password hashing, role middleware, request validation on key forms, rate limiting for authentication, Helmet, CORS, and centralized errors.
- Book inventory decrement on issue, return recording, capped manual overdue fines, reservations, CSV inventory export, and report overview endpoint.
- Optional MySQL contact inbox with parameterized queries; MongoDB remains the source of truth for library entities.
- Original local SVG book covers, hero illustration, and avatar assets with an asset manifest.
- Seed script, SQL schema, setup guide, API notes, database architecture notes, and small unit tests for the fine policy.

## Important limitations to finish before real-world use

- Password reset email delivery, refresh-token/session rotation, automated email notifications, file-upload route/UI, complete category/author/settings/audit-log management screens, and end-to-end tests are not implemented in this version.
- MySQL currently owns only contact/support messages; it is optional and is not a second copy of MongoDB library records.
- Borrowing rules and fine settings are currently fixed in backend code (14-day loan, ₹5/day, ₹500 cap, five active loans) rather than fully configurable from a settings screen.
- Multi-document issue/return consistency is not wrapped in a MongoDB transaction. For production, use a replica set and add transaction/retry handling before concurrent real-world use.
- Seed credentials are for local demonstration only. Change passwords and secrets before deployment.
- MongoDB/MySQL-backed end-to-end workflows were not exercised here because they require configured database services.
- Dependency installation reported 7 npm audit advisories (2 moderate, 5 high). Review the advisory details and update affected dependencies before deployment.

## Verification checklist

- [x] All server `.js` files passed `node --check` in the packaging environment.
- [x] Local SVG assets and asset manifest are included.
- [x] MySQL schema and Windows setup instructions are included.
- [x] Install npm dependencies.
- [x] Run `npm run build`, `npm test`, and `npm run lint`.
- [ ] Configure MongoDB and (if using contact forms) MySQL, then test login and workflows locally.
