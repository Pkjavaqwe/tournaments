FROM node:18-alpine

WORKDIR /app

# Copy common module
COPY common/package*.json ./common/
RUN cd common && npm install
COPY common ./common

# Copy participation service
COPY participation/package*.json ./participation/
RUN cd participation && npm install
COPY participation ./participation

WORKDIR /app/participation
CMD ["npm", "start"]
