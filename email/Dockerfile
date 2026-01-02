FROM node:18-alpine

WORKDIR /app

# Copy common module
COPY common/package*.json ./common/
RUN cd common && npm install
COPY common ./common

# Copy email service
COPY email/package*.json ./email/
RUN cd email && npm install
COPY email ./email

WORKDIR /app/email
CMD ["npm", "start"]
