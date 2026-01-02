FROM node:18-alpine

WORKDIR /app

# Copy common module
COPY common/package*.json ./common/
RUN cd common && npm install
COPY common ./common

# Copy organizer service
COPY organizer/package*.json ./organizer/
RUN cd organizer && npm install
COPY organizer ./organizer

WORKDIR /app/organizer
CMD ["npm", "start"]
