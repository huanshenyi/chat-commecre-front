FROM node:20-bookworm AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

COPY .env.production .env

RUN npm run build

FROM node:20-bookworm AS production

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

EXPOSE 3000
USER node

# Run the app when the container launches
CMD ["npm", "start"]