#############################
# Build React
#############################

FROM node:22-alpine AS builder

WORKDIR /app

ENV CI=true

RUN corepack enable

# Workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Only frontend package.json initially
COPY apps/web/package.json ./apps/web/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Now copy frontend source
COPY apps/web ./apps/web

WORKDIR /app/apps/web

RUN pnpm build


#############################
# Nginx
#############################

FROM nginx:alpine

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]