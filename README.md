# Todo List App

Weekly task planner with a React frontend and Express + MongoDB API.

- `frontend/` — React 19, Vite, TypeScript, TailwindCSS, Redux Toolkit
- `backend/` — Express, Mongoose, REST API under `/api/v1`

## Requirements

- Node.js 20+
- MongoDB

## Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API listens on `http://localhost:4000` by default.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs on `http://localhost:5173`.

In local development, leave `VITE_API_URL` empty in `frontend/.env`. Vite proxies `/api` to `http://localhost:4000`, so the browser calls `/api/v1/...` on port 5173.

## Scripts

| Location | Command | Purpose |
|----------|---------|---------|
| `backend/` | `npm run dev` | API with file watch + `.env` |
| `backend/` | `npm start` | API without watch |
| `frontend/` | `npm run dev` | Vite dev server |
| `frontend/` | `npm run build` | Production build to `frontend/dist` |

## Environment

### `backend/.env`

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/todo-list
CORS_ORIGIN=http://localhost:5173
```

### `frontend/.env`

```env
VITE_API_URL=
```

## API (overview)

Base path: `/api/v1`

- `GET /health` — health check
- `GET /tasks` — list tasks
- `POST /tasks` — create task
- `PATCH /tasks/:id` — update task
- `PATCH /tasks/:id/toggle` — toggle done
- `DELETE /tasks/:id` — delete task
