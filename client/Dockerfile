# For the frontend (React.js)
FROM node:14-alpine

WORKDIR /app/client

COPY package.json package-lock.json ./

RUN npm install --silent

COPY . .

CMD ["npm", "start"]
