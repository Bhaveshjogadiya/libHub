
# LibHub — Smart Library Management System

A full-stack library management project built with HTML5, CSS3, JavaScript, React + Vite, Tailwind CSS, Express, MongoDB, and an optional MySQL support inbox. It includes a responsive dashboard, local SVG image assets, authentication, role-aware API middleware, book/member management, borrowing/returns, reservations, fines, reports, API documentation, and seed data.

## Architecture decisions

- **MongoDB is the authoritative database** for users, books, categories, loans, reservations, fines, notifications, settings, and audit events.
- **MySQL owns the contact/support inbox** (`contact_messages`); MongoDB owns library entities. This separation avoids duplicate sources of truth and unsafe dual-writes. MySQL is optional for local development but included in the stack. To enable it, create the schema with `database/mysql-schema.sql` and configure the `MYSQL_*` variables.
- The browser talks to the Express REST API. JWTs are stored in secure, HTTP-only cookies; passwords use bcrypt.
- Demo covers and avatars are original local SVG illustrations, so the project works without third-party image URLs or image attribution dependencies.

## Requirements

- Node.js 20+
- MongoDB 7+ running locally or a MongoDB Atlas URI
- npm

## Quick start

1. Copy `Backend/.env.example` to `Backend/.env` and set `MONGODB_URI` and long random secrets.
2. (Optional, for the MySQL contact inbox) Run `database/mysql-schema.sql` in MySQL and set `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE` in `Backend/.env`.
3. From the project root, install dependencies:
   ```bash
   npm install
   npm run install:all
   ```
4. Seed demo data:
   ```bash
   npm run seed
   ```
5. Start the frontend and backend together:
   ```bash
   npm run dev
   ```
   `npm run dev` starts both processes with `concurrently`; client is at http://localhost:5173 and API at http://localhost:5000.

## Demo accounts

After running the seed script:
- Admin: `admin@libhub.local` / `ChangeMe123!`
- Librarian: `librarian@libhub.local` / `ChangeMe123!`
- Member: `member@libhub.local` / `ChangeMe123!`

These are **local-development-only** credentials. Change them before any real deployment. The seed script refuses to replace an existing user with the same email.

## Useful commands

- `npm run dev` — start frontend and backend
- `npm run build` — build the React app
- `npm run lint` — run ESLint in client and server
- `npm run test` — run backend tests
- `npm run seed` — insert demo data
- `npm run start` — run API in production mode

## Project structure

```text
LibHub/
├── Frontend/
│   ├── public/images/       # original SVG covers, hero, avatars
│   └── src/
│       ├── components/      # reusable layout, book cover, stat card
│       ├── pages/           # dashboard, catalog, login, management pages
│       ├── services/        # Axios API client
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── Backend/
│   ├── src/
│   │   ├── config/          # environment/database
│   │   ├── middleware/      # auth, roles, errors
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # REST API modules
│   │   ├── utils/           # async handler
│   │   ├── app.js
│   │   └── server.js
│   ├── scripts/seed.js
│   └── tests/
├── database/              # MySQL schema/migration
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── database-schema.md
└── package.json
```

## Important implementation notes

- Backend permissions are enforced by middleware, not only by frontend navigation.
- Inventory updates use conditional MongoDB updates to prevent available copies going below zero. For production deployments requiring multi-document consistency, run MongoDB as a replica set and wrap loan/inventory changes in a transaction.
- Fines are recorded manually; there is no payment gateway integration, and the UI must not imply online payments were processed.
- Password reset routes are documented as a production extension; configure an email provider and token delivery before exposing password resets publicly.
- An upload directory setting is reserved, but a complete Multer upload endpoint and upload UI are not implemented yet. Book covers use bundled local SVG paths.
- The included UI is a practical college-project foundation, not a claim of independently security-audited production readiness. Run tests and review configuration before deployment.

See `docs/IMPLEMENTATION_STATUS.md` for the verified build, lint, and unit-test results, plus an explicit list of remaining work. Database-backed workflows still need to be exercised with configured MongoDB and (optionally) MySQL services.

## MySQL contact inbox

`POST /api/contact` saves messages to MySQL; `GET /api/contact` and `PATCH /api/contact/:id/status` are admin-only. If MySQL is not configured, these endpoints return a clear 503 response instead of pretending the message was stored. See `docs/api.md`.

## Image assets

`Frontend/public/images/asset-manifest.json` lists each bundled asset. Replace SVGs with properly licensed local assets if needed. The current covers, library hero, and avatars are original vector artwork created for this project. Use descriptive alt text and keep a fallback cover in `BookCover.jsx`.

## Troubleshooting

- `MongooseServerSelectionError`: check MongoDB is running and `MONGODB_URI` is correct.
- Login fails after seeding: rerun `npm run seed` and use the local demo credentials above.
- Browser API errors: confirm API is running on port 5000 and `CLIENT_URL` matches the frontend origin.
- Port conflict: change `PORT` in `Backend/.env` or the Vite port in `Frontend/vite.config.js`.
"# libHub" 
