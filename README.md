# SPDA Web

Southern Province Development Authority web project.

## Folder structure

```
SPDA_web/
├── spda-welcome.html        Welcome page (Login button → applications/dashboard.html)
├── spda-features.js         Language switch + Login button for the welcome page
├── database.php             PostgreSQL connection (used by the PHP files)
├── applications/
│   ├── dashboard.html       Admin dashboard (static demo data, "Back to Home" link)
│   ├── check.php            API: GET  → list of applications (JSON)
│   └── create.php           API: POST → save a new application
└── frontend/                React admin app (connected to check.php / create.php)
    └── src/App.jsx
```

## 1. Welcome page + dashboard (no setup needed)

Open `spda-welcome.html` with the VS Code **Live Server** extension
(right-click → *Open with Live Server*).
Login → `applications/dashboard.html` → *Back to Home* → welcome page.

## 2. PHP API (needs PHP + PostgreSQL)

1. Start PostgreSQL. Check the details in `database.php`
   (database `SPDA_Database`, user `postgres`).
2. From the `SPDA_web` folder, run:
   ```
   php -S localhost:8000
   ```
   (Or put the folder in `C:\xampp\htdocs\` and start Apache in XAMPP.)
3. Test it in the browser: `http://localhost:8000/applications/check.php`

## 3. React app (frontend)

```
cd frontend
npm install
npm run dev
```

The app calls the PHP API at `http://localhost/SPDA_web` by default.
If your PHP server uses a different address, create `frontend/.env.local`:

```
VITE_API_URL=http://localhost:8000
```

Then restart `npm run dev`.
