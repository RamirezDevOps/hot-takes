# Hot Takes

Hot Takes is a full-stack website where users share short opinions and vote Agree or Disagree. It is a final project for Cornell DTI's Trends in Web Development course, built from the [official course starter](https://github.com/cornell-dti/trends-full-stack).

## Tech Stack

- React and TypeScript with Vite on the frontend
- Express and TypeScript on the backend
- React Router for navigation and Mantine for the existing header

## Running Locally

Install Node.js and pnpm before starting. The starter specifies pnpm 8.6.10.

From the project root, install dependencies and build the project:

```sh
pnpm install
pnpm build
```

Start both development servers:

```sh
pnpm dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:8080/takes](http://localhost:8080/takes)

Keep the terminal running while using the app. Press Ctrl+C to stop the servers.

## Features

- **Login (`/login`):** sign in with Google or sign out.
- **Feed (`/`):** view takes, vote, and sort by newest, most voted, or most controversial.
- **My Posts (`/my-posts`):** create, edit, and delete your own posts.

Posts and votes are stored in Firestore. Firebase Authentication identifies users; the server verifies sign-in tokens and checks post ownership.

## Seed Data

Codex added four sample takes and vote counts to help populate the feed. These examples are labeled **Hot Takes** and are separate from users' posts. Existing seed posts are left unchanged.

## API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/takes` | Return all takes |
| POST | `/takes` | Create a take |
| PUT | `/takes/:id` | Record a vote or update post text |
| DELETE | `/takes/:id` | Delete a take |

## Project Structure

- `frontend/src/pages/`: Login, Feed, and My Posts
- `frontend/src/components/`: shared UI components
- `backend/server.ts`: Express server and routes
- `backend/seed.ts`: sample take data
- `lib/types/index.ts`: shared TypeScript types

This README was written with Codex assistance.
