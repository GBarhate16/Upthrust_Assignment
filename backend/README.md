## Backend - Upthrust Assignment

### Environment
Create `.env` or `env` in this folder:

```
PORT=4000
# Optional AI
GEMINI_API_KEY=your_key

# Postgres (native, no Docker)
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<db>
PGSSL=false
```

Notes:
- If your Postgres requires SSL, set `PGSSL=true`.
- The server will auto-create table `workflow_runs` if it doesn't exist.

### Install & Run

```
npm install
npm run dev
```

Health: `GET /health`

### API

POST `/run-workflow`

```
{ "prompt": "Write a tweet about today's weather", "action": "weather", "location": "Delhi" }
```

GET `/history` → last 10 runs (returns `[]` if DB not configured)

DELETE `/history/:id` → delete specific history item by ID

DELETE `/history` → delete all history items (requires confirmation)


