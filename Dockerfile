# Selfish web preview — static Expo export, served on $PORT.
# Works when Railway is connected to the repo root (the usual case).

FROM node:20-bookworm-slim AS build
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY apps/mobile/package.json apps/mobile/package-lock.json ./
RUN npm ci --include=dev

COPY apps/mobile/ ./

ENV CI=1 \
    EXPO_NO_TELEMETRY=1 \
    NODE_ENV=production \
    NODE_OPTIONS=--max-old-space-size=4096

RUN npm run build

FROM node:20-bookworm-slim
WORKDIR /app

RUN npm install -g serve@14.2.6

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "serve dist --listen tcp://0.0.0.0:${PORT:-3000}"]
