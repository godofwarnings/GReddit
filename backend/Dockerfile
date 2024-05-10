FROM node:18
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4000
CMD ["node", "server.js"]
