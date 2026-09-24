# SPDA Web

Southern Province Development Authority web project.

## Folder structure

```
SPDA_web/
├── database.php                 PostgreSQL connection (used by the PHP files)
├── auth/                        Login API: register.php, login.php, me.php, logout.php
├── database/auth_tables.sql     users + user_tokens tables (created automatically too)
├── applications/
│   ├── check.php                API: GET  → list of applications (JSON)
│   └── create.php               API: POST → save a new application
└── frontend/                    ← the main website (Vite + React)
    ├── index.html               Welcome page (logo animation + Login button)
    ├── login.html               Login / Register page (src/auth/LoginPage.jsx)
    ├── dashboard.html           React dashboard page (login required)
    ├── public/spda-features.js  Language switch + Login button → /login.html
    └── src/
        ├── App.jsx              React dashboard (Back + Logout buttons in the header)
        └── auth/                Login page, login check (AuthGate), session helpers
```

`spda-welcome.html` and `spda-features.js` in the root folder are older copies
of the welcome page. The live version is `frontend/index.html`.

## Run the website (one terminal)

```
cd frontend
npm install        (first time only)
npm run dev
```

`npm run dev` starts **both** the React site and the PHP API
(`php -S localhost:8000` from the SPDA_web folder). PHP must be installed.

- Welcome page:   http://localhost:5173/
- Login button →  http://localhost:5173/login.html (Login / Register)
- After login  →  http://localhost:5173/dashboard.html (React dashboard)

The React code calls the PHP files through `/api/...`
(for example `/api/auth/login.php`), which Vite forwards to `localhost:8000`.

## Database

PostgreSQL must be running. Check the details in `database.php`
(database `SPDA_Database`, user `postgres`).

The `users` and `user_tokens` tables are created automatically the first time
someone registers or logs in (or run `database/auth_tables.sql` in pgAdmin).

## Build for hosting

```
cd frontend
npm run build
```

The finished site is in `frontend/dist/` (both `index.html` and `dashboard.html`).
