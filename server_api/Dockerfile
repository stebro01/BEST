FROM node:14
WORKDIR /usr/mail_service
COPY package*.json ./
COPY ssl/* ./ssl/
RUN npm install
RUN npm install -g nodemon
COPY . .
EXPOSE 3000
# CMD ["nodemon", "./src/app.js"]
CMD ["node", "./src/app.js"]
