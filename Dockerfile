# Production Dockerfile for PayloadCMS with Next.js
# Requires `output: 'standalone'` in next.config.js

FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable corepack for yarn support
RUN corepack enable

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then \
    echo "Using yarn for dependency installation..." && \
    yarn config set nodeLinker node-modules && \
    yarn --frozen-lockfile && \
    echo "Yarn installation completed" && \
    ls -la /app/ && \
    test -d /app/node_modules && echo "node_modules directory exists" || (echo "node_modules directory missing!" && exit 1); \
  elif [ -f package-lock.json ]; then \
    echo "Using npm for dependency installation..." && \
    npm ci && \
    echo "NPM installation completed" && \
    ls -la /app/ && \
    test -d /app/node_modules && echo "node_modules directory exists" || (echo "node_modules directory missing!" && exit 1); \
  elif [ -f pnpm-lock.yaml ]; then \
    echo "Using pnpm for dependency installation..." && \
    corepack enable pnpm && pnpm i --frozen-lockfile && \
    echo "PNPM installation completed" && \
    ls -la /app/ && \
    test -d /app/node_modules && echo "node_modules directory exists" || (echo "node_modules directory missing!" && exit 1); \
  else \
    echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Enable corepack for yarn support
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
# Verify node_modules was copied successfully
RUN ls -la /app/node_modules && echo "node_modules copied successfully"

COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Disable telemetry during build for production
ENV NEXT_TELEMETRY_DISABLED 1

# Generate Payload types before building
RUN \
  if [ -f yarn.lock ]; then yarn generate:types && yarn run build; \
  elif [ -f package-lock.json ]; then npm run generate:types && npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run generate:types && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Disable telemetry during runtime for production
ENV NEXT_TELEMETRY_DISABLED=1

# Add necessary packages for production
RUN apk add --no-cache wget

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Remove this line if you do not have this folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8890

ENV PORT=8890
ENV HOSTNAME="0.0.0.0"

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8890/api/health || exit 1

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
