#Build step

FROM node:19.3.0 AS build
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=error
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --force
COPY . .
RUN npm run build || true

#Deployment step

FROM busybox:1.35 as deploy

RUN adduser -D static
USER static
WORKDIR /home/static

COPY --from=build /app/build/ ./

EXPOSE 3000

CMD ["busybox", "httpd", "-f", "-v", "-p", "3000"]