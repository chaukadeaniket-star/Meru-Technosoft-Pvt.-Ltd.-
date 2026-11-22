# Meru Lead Manager

A small full stack lead tracking app built for the Meru Technosoft Pvt. Ltd. Full Stack Developer screening assignment. It supports creating, viewing, editing, filtering, and deleting leads, with status counts for the pipeline.

## Tech stack

- Frontend: React 19, Vite, Axios, and custom CSS (with Tailwind CSS included in the Vite setup)
- API: Node.js, Express 5, and express-validator
- Database: MongoDB with Mongoose
- API tests: Jest and Supertest

## Requirements

- Node.js 20.19+ or 22.12+ (required by the Vite version in this project)
- npm
- MongoDB running locally or a MongoDB connection URI

## Run locally

1. In `server/`, copy `.env.example` to `.env` and set `MONGODB_URI` if your MongoDB connection differs from the local default. The default API port is `5000`.
2. In `client/`, copy `.env.example` to `.env`. The default `VITE_API_URL` points to `http://localhost:5000/api`.
3. In a terminal, run the API:

   ```sh
   cd server
   npm install
   npm run dev
   ```

4. In a second terminal, run the frontend:

   ```sh
   cd client
   npm install
   npm run dev
   ```

5. Open the local URL printed by Vite (normally `http://localhost:5173`). The API health endpoint is `http://localhost:5000/api/health`.

## API

All endpoints are prefixed with `/api`:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/leads?search=...&status=...` | List and filter leads (search matches name, company, or email) |
| GET | `/leads/:id` | Get one lead |
| POST | `/leads` | Create a lead |
| PUT | `/leads/:id` | Update a lead |
| DELETE | `/leads/:id` | Delete a lead |
| GET | `/health` | Check API availability |

Lead fields are `name`, `email`, `phone`, `company`, `source`, and `status`. Status values are `New`, `Contacted`, `Qualified`, and `Lost`. Sources are `Website`, `Referral`, `LinkedIn`, `Cold Call`, `Event`, and `Other`. The API validates required fields, email format, lengths, and allowed enum values. MongoDB schema validation provides a second validation layer.

## Checks

Run the API tests from `server/` with `npm test`. From `client/`, run `npm run lint` and `npm run build`.

## Assumptions and scope

- This is a single shared workspace; authentication and per-user lead ownership are outside the required core scope.
- Leads are ordered newest first. Search is case-insensitive and includes company and email in addition to the required name search.
- The browser asks for confirmation before deleting a lead.
- No live deployment is configured.

## What I would improve with more time

- Add authentication and user-scoped lead access.
- Add pagination and more complete keyboard/accessibility support.
- Add integration tests against a disposable MongoDB instance and deploy the app.

## Note

I’m particularly proud that the UI, API validation, database model, filters, and status dashboard work together as one compact flow. Handling validation errors consistently across the form and API was the trickiest part.
