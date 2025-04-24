FROM node:18

WORKDIR /app/judger

COPY judger/ .

RUN npm install

EXPOSE 10000

CMD ["npm", "run", "dev"]
