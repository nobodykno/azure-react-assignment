# ---------- Builder ----------
    FROM node:22-alpine AS builder

    WORKDIR /app
    
    ENV CI=true
    
    RUN corepack enable
    RUN corepack prepare pnpm@11.20.0 --activate
    
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY tsconfig.base.json ./
    
    COPY apps ./apps
    COPY packages ./packages
    COPY services/api ./services/api
    
    RUN pnpm install --frozen-lockfile
    
    RUN pnpm --filter azure-db build
    RUN pnpm --filter azure_api build
    
    
    # ---------- Runtime ----------
    FROM node:22-alpine
    
    WORKDIR /app
    
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/packages ./packages
    COPY --from=builder /app/services/api ./services/api
    
    WORKDIR /app/services/api
    
    EXPOSE 5001
    
    CMD ["node", "dist/server.js"]