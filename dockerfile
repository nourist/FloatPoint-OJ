FROM node:18

WORKDIR /app/judger

COPY judger/ .

RUN apt-get update
RUN npm install

EXPOSE 10000

CMD ["npm", "run", "dev"]
