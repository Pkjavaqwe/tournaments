FROM node:18-alpine

WORKDIR /app

# Copy common module
COPY common/package*.json ./common/
RUN cd common && npm install
COPY common ./common

# Copy query service
COPY query/package*.json ./query/
RUN cd query && npm install
COPY query ./query

WORKDIR /app/query
CMD ["npm", "start"]
