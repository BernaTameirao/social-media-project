FROM node:22

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/src/main.js"]