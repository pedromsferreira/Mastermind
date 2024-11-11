FROM node:23-bookworm

WORKDIR /app 

COPY package.json .

RUN npm install

RUN npm run build

EXPOSE 8668

CMD ["npm", "run", "preview"]