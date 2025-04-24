FROM node:18

WORKDIR /app/judge

COPY judge/package*.json ./judge/

RUN npm install

COPY judge/ .

EXPOSE 10000

CMD ["npm", "run", "dev"]
