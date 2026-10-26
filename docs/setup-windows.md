# Windows setup (beginner-friendly)

## 1. Install prerequisites

- Install Node.js 20 or newer (the installer includes npm).
- Install MongoDB Community Server, or create a MongoDB Atlas database.
- MySQL 8 is optional for the contact/support inbox; install it only if you want that module enabled.

## 2. Configure environment

From the `LibHub` folder, copy `Backend/.env.example` to `Backend/.env` and edit `MONGODB_URI` and `JWT_SECRET`. For local MongoDB, the default URI is `mongodb://127.0.0.1:27017/libhub`.

For MySQL, run `database/mysql-schema.sql` in MySQL Workbench, then fill in the `MYSQL_*` variables in `Backend/.env`. If MySQL is not configured, the library features still work, but contact submission is disabled and returns a clear error.

## 3. Install packages

Open Command Prompt or the VS Code terminal in the `LibHub` folder and run:

```bat
npm install
npm run install:all
```

## 4. Add demo data and start

Make sure MongoDB is running, then run:

```bat
npm run seed
npm run dev
```

Open `http://localhost:5173`. The API health endpoint is `http://localhost:5000/api/health`.

## Demo accounts

- Admin: `admin@libhub.local` / `ChangeMe123!`
- Librarian: `librarian@libhub.local` / `ChangeMe123!`
- Member: `member@libhub.local` / `ChangeMe123!`

These credentials are only for local demonstrations. Change them before deploying.

## Common problems

- **MongoDB connection error:** start MongoDB and verify `MONGODB_URI`.
- **Port already in use:** change `PORT` in `Backend/.env` or stop the other process.
- **MySQL contact error:** confirm MySQL is running, create the database/table using `database/mysql-schema.sql`, and check all `MYSQL_*` variables.
- **Login fails:** run `npm run seed` and use one of the demo accounts.
