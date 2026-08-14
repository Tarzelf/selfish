# selfish

A minimal [Next.js](https://nextjs.org) (App Router) starter used to bootstrap and validate the Cloud Agent development environment for this repository.

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- ESLint (`eslint-config-next`)

## Getting started

```bash
npm ci        # install dependencies from the lockfile
npm run dev   # start the dev server on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000). Enter a name and press **Say hello** to exercise the full client → server round trip against the `POST /api/greet` route handler.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server (http://localhost:3000). |
| `npm run build` | Create an optimized production build (also type-checks). |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |

## Cloud Agent environment

The Cloud Agent environment is defined in [`.cursor/environment.json`](.cursor/environment.json):

- `install`: `npm ci` — restores dependencies from `package-lock.json`.
- `terminals`: runs `npm run dev` so the development server is available on port 3000.
