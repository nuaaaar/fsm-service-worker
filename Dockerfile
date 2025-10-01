FROM oven/bun:alpine AS builder
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .

# Build aplikasi (misal output ke /app/dist)
RUN bun build src/worker.ts --outdir dist --target bun

# Production image, hanya ambil hasil build
FROM oven/bun:alpine
WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json

ENV NODE_ENV=production

USER bun
CMD ["bun", "run", "dist/worker.js"]
