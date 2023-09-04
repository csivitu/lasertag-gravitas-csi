FROM node:18-alpine
WORKDIR /app
RUN npm install --production
COPY . .
CMD ["node", "src/index.js"]
EXPOSE ${PORT}