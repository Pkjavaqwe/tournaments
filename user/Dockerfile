FROM node:18-alpine

WORKDIR /app

# Copy common module
COPY common/package*.json ./common/
RUN cd common && npm install
COPY common ./common

# Copy user service
COPY user/package*.json ./user/
RUN cd user && npm install
COPY user ./user

WORKDIR /app/user
CMD ["npm", "start"]
