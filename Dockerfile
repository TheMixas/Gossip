# ---------- 1. Build the React client ----------
FROM node:20-slim AS client
WORKDIR /client
COPY client/package.json client/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY client/ .
ENV CI=false
RUN npm run build

# ---------- 2. Server: REST API + Socket.IO chat + the built client ----------
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production PORT=8080 UPLOADS_DIR=/data/uploads
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY server/ .
COPY --from=client /client/build ./public
EXPOSE 8080
CMD ["node", "app.js"]
