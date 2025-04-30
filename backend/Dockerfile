FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . ./

ENV NODE_ENV=development

EXPOSE 5000

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm start; else npm run dev; fi"]
