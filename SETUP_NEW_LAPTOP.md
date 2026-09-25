# Setting up SPDA on a laptop (step by step)

Follow these steps once on each laptop. After that, use the daily steps at the bottom.

## 0. Programs you need

| Program | How to check | Where to get it |
|---|---|---|
| Git | `git --version` | git-scm.com |
| Node.js (LTS) | `node -v` | nodejs.org |
| XAMPP (PHP) | `php -v` | apachefriends.org |
| PostgreSQL + pgAdmin | pgAdmin opens | postgresql.org |

Run the checks in a VS Code terminal (`Ctrl` + `` ` ``).

If `npm` says **running scripts is disabled**, run this once and answer `Y`:
```
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## 1. Get the code

**If the laptop does NOT have `C:\SPDA_web` yet**, open PowerShell and run:
```
cd C:\
git clone https://github.com/malingaprabhath7-maker/SPDA.git SPDA_web
```

**If it already has `C:\SPDA_web`**, run:
```
cd C:\SPDA_web
git stash
git pull origin main
```
(`git stash` puts away any old local changes so the pull does not fail.)

Then in VS Code: **File → Open Folder → `C:\SPDA_web`**.
Always use `C:\SPDA_web`. Do not use old copies (like `C:\SPDA`).

## 2. Install the packages (first time only)

```
cd C:\SPDA_web
npm install
```
Wait until you see `added ... packages`.

## 3. Turn on the PostgreSQL driver in PHP (first time only)

1. Run `code C:\xampp\php\php.ini`
2. Press `Ctrl + F` and find `;extension=pdo_pgsql`. Remove the `;` at the start.
3. Do the same for `;extension=pgsql`.
4. Save with `Ctrl + S` (choose **Retry as Admin** if asked).
5. Check it:
   ```
   php -m | findstr pgsql
   ```
   You must see `pdo_pgsql` and `pgsql`.

## 4. Create the database (first time only)

1. Open **pgAdmin** → **PostgreSQL 14** (or your version) → right-click **Databases** → **Create → Database...**
2. Name: **`SPDA_Database`** (type it exactly, with capital letters) → **Save**.
3. Right-click **SPDA_Database** → **Query Tool**.
4. Click the 📂 **Open File** icon → choose `C:\SPDA_web\database\spda_database.sql`.
5. Press **F5**. You should see `Query returned successfully`.

The database password must match `database.php` (user `postgres`, password `pwd@123`).
If your PostgreSQL password is different, change it in `database.php` on your laptop
(do not push that change).

## 5. Run the website

```
cd C:\SPDA_web
taskkill /F /IM php.exe
npm run dev
```
- `taskkill` stops any old PHP server. "not found" is fine.
- You should see `PHP API starting on http://localhost:8000` and `Local: http://localhost:5173/`.

Open **http://localhost:5173/** in the browser.

## 6. Create your account

Welcome page → **Login** → **Register** tab.
- Username: letters and numbers only (no `@`, no spaces), for example `nimal`.
- Password: at least 6 characters.

**Each laptop has its own database.** An account made on one laptop does not exist on the
other laptops. Everyone registers once on their own laptop.

---

## Every day

Start:
```
cd C:\SPDA_web
git pull origin main
npm run dev
```

Finish (save your work to GitHub):
```
git add .
git commit -m "what you changed"
git pull origin main
git push origin main
```

If the database script (`database/spda_database.sql`) was updated, run it again in pgAdmin
(step 4, parts 3-5). It never deletes data.

---

## Problems and fixes

| Message | Fix |
|---|---|
| `Could not read package.json` | You are in the wrong folder. Run `cd C:\SPDA_web` first. |
| `'vite' is not recognized` | Run `npm install`. |
| `running scripts is disabled` | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. |
| `Port 5173 is in use` | Another `npm run dev` is still open. Close the other terminals (🗑️). |
| `could not find driver` | Step 3, then `taskkill /F /IM php.exe` and `npm run dev` again. |
| `database "SPDA_Database" does not exist` | Step 4. |
| `password authentication failed` | Your PostgreSQL password is different. Change it in `database.php`. |
| `Connection refused` | PostgreSQL is not running. Open pgAdmin / start the PostgreSQL service. |
| `Cannot reach the server` | `npm run dev` is not running, or PHP did not start. Run step 5 again. |
| `Invalid username or password` | That account does not exist on this laptop. Register first. |
| `Your local changes would be overwritten` | Run `git stash`, then `git pull origin main`. |
