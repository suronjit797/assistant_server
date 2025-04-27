FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 5000

# Run dev server (using ts-node-dev)
CMD ["yarn", "dev"]
