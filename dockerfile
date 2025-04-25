FROM node:18

WORKDIR /app/judger

COPY judger/ .

RUN apt-get update && apt-get install -y time
RUN npm install

EXPOSE 10000

CMD ["npm", "start"]
