# For the backend (Express.js)
FROM node:14-alpine

WORKDIR /app/server

COPY package.json package-lock.json ./

RUN npm install --silent

COPY . .

CMD ["node", "server.js"]