FROM node:23-alpine

WORKDIR /cloud

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]