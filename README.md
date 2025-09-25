# HoppeR HR Ticketing System (Student README)

A simple full‑stack app for HR ticket management with real‑time chat.

## Tech
- Backend: Node.js, Express, MongoDB (Mongoose), Socket.IO
- Frontend: Angular + PrimeNG

## Project structure
- `backend/` Express API, Socket.IO, serves built frontend from `backend/public/`
- `frontend/` Angular app (built to `frontend/dist/hopper/browser`)

## Environment (.env in backend)
```
DB_URI=mongodb://localhost:27017/hr-ticketing-system
PORT=3000
NODE_ENV=development
JWT_SECRET=change-me
JWT_EXPIRES_IN=24h
```
(Use your MongoDB Atlas URI for cloud.)

## First time setup
```
# Backend deps
cd backend && npm install
# Frontend deps
cd ../frontend && npm install
```

## Seed demo data (users/tickets)
```
cd backend
node utils/seed.js
```

## Run locally (two terminals)
- API + static site (prod build):
```
cd backend
npm run build:frontend && npm run copy:frontend
npm start
# opens http://localhost:3000
```
- Angular dev (hot reload):
```
cd frontend
npm start
# opens http://localhost:4200
```
Note: port 4200 is the dev server; port 3000 serves the built app.

## Real‑time chat
- Works with Socket.IO after login.
- Presence shows when both users have a page open.
- Employee chat icon (bottom‑left) lists online HR; HR chat lists online employees.

## Demo logins
- HR: `EMP002 / 1234`
- Employee: `EMP007 / 1234`
(From seed script.)

## Build + copy (when UI changes)
```
cd backend
npm run build:frontend && npm run copy:frontend
```

## Deploy (Render)
- Root has scripts Render can use:
  - Build: `npm run build` (builds frontend, copies to backend/public)
  - Start: `npm start` (runs backend/server.js)
- Set env vars in Render: `DB_URI`, `JWT_SECRET`, `NODE_VERSION=18`.

## Troubleshooting
- Port busy: `lsof -ti:3000 | xargs kill -9` (same for 4200)
- If chat presence doesn’t show: make sure you are logged in on both sides and pages stay open.

Enjoy! 🙂
