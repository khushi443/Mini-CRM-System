# Mini CRM System

A minimal CRM with a plain HTML/CSS/JS frontend and a NestJS + Prisma + PostgreSQL backend.

## Structure

```
Mini-CRM-System/
├── frontend/        # static HTML/CSS/JS — served via Live Server (or any static server)
└── backend/         # NestJS + Prisma REST API
```

## Backend setup

```bash
cd backend
npm install

# copy the example env file and fill in your real local Postgres password
cp .env.example .env
# edit .env and replace PASSWORD with your actual postgres password

npx prisma generate
npx prisma migrate dev

npm run start:dev
```

The API listens on `http://localhost:3000`.

### Auth endpoints

- `POST /auth/register` — `{ name, email, password }` → creates a user (password hashed with bcrypt, hash never returned)
- `POST /auth/login` — `{ email, password }` → `{ access_token, user }`
- `GET /auth/profile` — requires `Authorization: Bearer <token>`

Plus the existing leads/tasks/notes/followups routes.

## Frontend setup

Open `frontend/index.html` with a static server (e.g. VS Code Live Server on port 5501). It talks to the backend
at the URL configured in `frontend/js/config.js` (`http://localhost:3000` by default).

Flow: `index.html` (login) → `register.html` → back to `index.html` on successful registration → `dashboard.html`
on successful login, with the token stored in `localStorage`.

## Notes

- `backend/.env` holds your real local database credentials and is git-ignored. Only `backend/.env.example`
  (with a placeholder password) is meant to be committed.
- `mini_crm` is the expected database name — the project does not create or rename databases on its own.
