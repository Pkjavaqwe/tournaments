FROM node:18-alpine

WORKDIR /app

# Copy common module
COPY common/package*.json ./common/
RUN cd common && npm install
COPY common ./common

# Copy tournament service
COPY tournament/package*.json ./tournament/
RUN cd tournament && npm install
COPY tournament ./tournament

WORKDIR /app/tournament
CMD ["npm", "start"]
