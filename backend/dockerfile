# Use the official Node.js image 
FROM node:20-slim

WORKDIR /app/ApiGateway

# Copy shared folder
COPY shared /app/shared

# Copy package.json and package-lock.json
COPY ApiGateway/package*.json ./
RUN npm install

# Copy the rest of the app
COPY ApiGateway/server.js ./
COPY ApiGateway/routes ./routes
COPY ApiGateway/middleware ./middleware

EXPOSE 4123

CMD ["node", "server.js"]
