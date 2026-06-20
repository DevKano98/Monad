FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV AXIOM_MCP_TRANSPORT=http
ENV AXIOM_MCP_HOST=0.0.0.0
ENV AXIOM_MCP_PATH=/mcp
ENV PORT=3333

COPY package.json ./
RUN npm install --omit=dev

COPY index.js ./index.js
COPY index.d.ts ./index.d.ts
COPY server.js ./server.js

EXPOSE 3333

CMD ["node", "server.js"]
