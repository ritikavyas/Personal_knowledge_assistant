FROM node:20 AS builder

# Create app directory
WORKDIR /app

# Copy package manifests and install all deps (including devDeps) so tsc is available
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

### Runtime image
FROM node:20-slim AS runner
WORKDIR /app

# Copy built files
COPY --from=builder /app/dist ./dist

# Copy production dependencies only
COPY package.json ./
ENV NODE_ENV=production
RUN npm ci --production --silent

EXPOSE 3001
CMD ["node", "dist/index.js"]
