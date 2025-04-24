FROM node:18

COPY judger/package*.json ./judger/

RUN npm install
WORKDIR /app/judger

COPY judger/ .

EXPOSE 10000

CMD ["npm", "run", "dev"]
