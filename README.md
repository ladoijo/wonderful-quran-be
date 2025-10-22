# Wonderful Quran Backend

Wonderful Quran Backend is a lightweight Node.js/Express service that wraps the
[Quran Foundation APIs](https://quran.foundation/) with a simplified, typed
interface. It handles OAuth2 client-credential authentication, token caching,
and consistent logging so clients can focus on consuming Qur'an metadata and
verse content without managing the upstream auth workflow.

## Features

- Express 5 server that exposes REST endpoints under `/api`
- OAuth2 client credentials flow with in-memory token caching
- Schema validation for request queries via Zod
- Structured logging using Pino & `pino-http`
- Fully typed TypeScript source compiled with `tsc`

## Project Structure

- `src/server.ts` – boots the Express server
- `src/app.ts` – configures middleware, logging, and routing
- `src/routes/qf.routes.ts` – Qur'an Foundation API-backed routes
- `src/services/qfClient.ts` – OAuth token management and upstream requests
- `src/utils` – environment variable loader & reusable error helpers

## Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) (recommended by the repo via `packageManager`)

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create a `.env` file (or copy `.env.example`) and fill in your Quran Foundation
credentials:

```dotenv
QF_ENV=prelive
QF_API_BASE_URL=https://apis-prelive.quran.foundation
QF_AUTH_URL=https://prelive-oauth2.quran.foundation
QF_CLIENT_ID=your_client_id
QF_CLIENT_SECRET=your_client_secret
PORT=3000
LOG_LEVEL=info
```

> The service throws on startup if any required variable is missing.

### Scripts

- `pnpm dev` – run the API in watch mode using `.env.dev`
- `pnpm prod` – watch mode using `.env`
- `pnpm build` – type-check and emit JavaScript to `dist/`
- `pnpm build:lambda` – bundle the Lambda handler with esbuild into `dist-lambda/`
- `pnpm start` – run the compiled server from `dist/`
- `pnpm lint` – run Biome lint
- `pnpm format` – run Prettier

## Running Locally

```bash
pnpm dev
```

The server listens on `http://localhost:PORT` (defaults to `3000`). A health
check is available at `/health`.

## API Endpoints

All application routes are namespaced under `/api`.

| Method | Path                                | Description                                                                                     |
| ------ | ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| GET    | `/api/chapters`                     | List all chapters. Optional `language` query (default `en`).                                    |
| GET    | `/api/chapters/:chapterId`          | Fetch chapter details by id. Optional `language` query.                                         |
| GET    | `/api/chapters/:chapterId/verses`   | Fetch verses by chapter id with query parameters for paging, translations, words, tafsirs etc.  |
| GET    | `/api/juzs`                         | List all Juz (sections).                                                                        |
| GET    | `/api/juzs/:juzNumber/verses`       | Fetch verses by Juz number with query parameters similar to the chapter verses endpoint.        |

### Query Parameters for Verse Endpoints

`language`, `words`, `translations`, `audio`, `tafsirs`, `word_fields`,
`translation_fields`, `fields`, `page`, `per_page`

Validation & defaults are handled with Zod inside the route definitions.

### Sample Request

```bash
curl "http://localhost:3000/api/chapters/1/verses?language=en&per_page=5"
```

## Logging

Logging is provided by Pino with pretty-printing enabled in development. You can
control verbosity with the `LOG_LEVEL` environment variable.

## Deployment Notes

- Ensure production credentials and base URLs are configured (`QF_ENV=production`)
- `pnpm build:lambda` creates a single-file bundle at `dist-lambda/server.mjs` optimised for AWS Lambda
- Stage a deployment bundle by copying `dist-lambda/` and running `pnpm install --prod` in a clean folder (or reuse `pnpm deploy --prod`)
- Zip the staged folder so the archive root contains `dist-lambda/server.mjs` (handler `dist-lambda/server.handler`) and any required assets
- Configure Lambda environment variables (`QF_*`, `LOG_LEVEL`) via the console or IaC
- Consider persisting OAuth tokens externally if running multiple replicas

## License

ISC © Hadyan Putra Yasrizal
