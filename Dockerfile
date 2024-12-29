FROM node:alpine AS base

RUN apk add --no-cache g++ make py3-pip libc6-compat

WORKDIR /app
COPY package.json package-lock.json .npmrc ./
EXPOSE 3000

FROM base AS build
WORKDIR /app

COPY . ./

RUN npm run build

FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# Similar to command `npm run ci`
RUN npm run ci

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

CMD npm run start

FROM base AS dev
ENV NODE_ENV=development

RUN npm install 
COPY . ./

CMD ["yarn", "run", "dev"]