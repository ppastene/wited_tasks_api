FROM node:24.14.1-slim

RUN useradd -ms /bin/sh -u 1001 app

WORKDIR /app

COPY backend/package*.json ./
RUN chown -R app:app /app
USER app
RUN npm install
COPY --chown=app:app backend/ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]