# SPDA Web

Southern Province Development Authority web project.

## Folder structure

```
SPDA_web/
├── database.php                 PostgreSQL connection (used by the PHP files)
├── applications/
│   ├── check.php                API: GET  → list of applications (JSON)
│   └── create.php               API: POST → save a new application
└── frontend/                    ← the main website (Vite + React)
    ├── index.html               Welcome page (logo animation + Login button)
    ├── dashboard.html           React dashboard page (loads src/main.jsx)
    ├── public/spda-features.js  Language switch + Login button → /dashboard.html
    └── src/App.jsx              React dashboard
```

`spda-welcome.html` and `spda-features.js` in the root folder are older copies
of the welcome page. The live version is `frontend/index.html`.

## Run the website

```
cd frontend
npm install        (first time only)
npm run dev
```

- Welcome page:   http://localhost:5173/
- Login button →  http://localhost:5173/dashboard.html (React dashboard)

## PHP API (needed for real database data)

1. Start PostgreSQL. Check the details in `database.php`
   (database `SPDA_Database`, user `postgres`).
2. From the `SPDA_web` folder, run `php -S localhost:8000`
   (or put the folder in `C:\xampp\htdocs\` and start Apache in XAMPP).
3. Tell the React app where the API is. Create `frontend/.env.local`:
   ```
   VITE_API_URL=http://localhost:8000
   ```
   Then restart `npm run dev`.

Without the PHP API the dashboard still opens and shows sample data.

## Build for hosting

```
cd frontend
npm run build
```

The finished site is in `frontend/dist/` (both `index.html` and `dashboard.html`).
