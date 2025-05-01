FROM node:22-alpine

WORKDIR /app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Copy and install dependencies based on NODE_ENV
COPY package.json ./
COPY package-lock.json ./

RUN if [ "$NODE_ENV" = "production" ]; then npm install --omit=dev; else npm install; fi

# Copy the rest of the application code
COPY . .

EXPOSE 5000

# Start the application based on NODE_ENV
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run start; else npm run dev; fi"]

