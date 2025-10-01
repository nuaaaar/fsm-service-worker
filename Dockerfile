# Dockerfile
FROM oven/bun:alpine

WORKDIR /app

# Kalau nanti pakai native module, aktifkan baris di bawah:
# RUN apk add --no-cache python3 make g++

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .

# Worker tidak expose port
ENV NODE_ENV=production
CMD ["bun", "run", "start"]