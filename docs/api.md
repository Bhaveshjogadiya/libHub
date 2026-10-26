
# API quick reference

All responses are JSON except inventory export. Send credentials with `withCredentials: true`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create member account |
| POST | `/api/auth/login` | Public | Sign in |
| POST | `/api/auth/logout` | Public | Clear session cookie |
| GET | `/api/auth/me` | Signed in | Current user |
| GET | `/api/books` | Public | Search/filter/paginate catalog |
| GET | `/api/books/:id` | Public | Book detail |
| POST | `/api/books` | Admin/librarian | Create book |
| PATCH | `/api/books/:id` | Admin/librarian | Update book |
| DELETE | `/api/books/:id` | Admin | Delete book if no active loans |
| GET/POST | `/api/members` | Admin/librarian | List/create members |
| PATCH | `/api/members/:id` | Admin/librarian | Update member |
| GET | `/api/loans` | Signed in | Own loans for member; all for staff |
| POST | `/api/loans/issue` | Admin/librarian | Issue book |
| POST | `/api/loans/:id/return` | Admin/librarian | Return book and calculate fine |
| GET/POST | `/api/reservations` | Signed in | List/create reservations |
| PATCH | `/api/reservations/:id/cancel` | Owner/staff | Cancel reservation |
| GET | `/api/fines` | Signed in | Own fines for member; all for staff |
| POST | `/api/fines/:id/pay` | Admin/librarian | Record manual payment |
| POST | `/api/fines/:id/waive` | Admin | Waive fine |
| GET | `/api/reports/overview` | Admin/librarian | Real database statistics |
| GET | `/api/reports/export` | Admin/librarian | CSV inventory export |
| GET | `/api/health` | Public | API/database health |

Errors use `{ "message": "..." }`; validation errors may include an `errors` array. Apply further schema-specific validators and audit logging before public deployment.


## Contact inbox (MySQL)

- `POST /api/contact` — public; validates and saves a support message in MySQL.
- `GET /api/contact` — admin only; lists up to 200 newest messages.
- `PATCH /api/contact/:id/status` — admin only; status is `new`, `in_progress`, or `resolved`.
- `GET /api/health` — checks MongoDB and the optional MySQL subsystem.

Apply `database/mysql-schema.sql` before enabling the MySQL contact inbox. The inbox stores contact messages only; it does not duplicate MongoDB library records.
