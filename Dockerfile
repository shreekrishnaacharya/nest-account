FROM node:18-alpine

# Install PM2
RUN npm install -g pm2

# Set working directory
RUN mkdir -p /var/www/nest-ecommerce-api
WORKDIR /var/www/nest-ecommerce-api

RUN chmod -R 777 /var/www/nest-ecommerce-api

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /var/www/nest-ecommerce-api/node_modules/.bin:$PATH
# create user with no password
RUN adduser --disabled-password demo

# Copy existing application directory contents
COPY . /var/www/nest-ecommerce-api
# install and cache app dependencies
COPY package.json /var/www/nest-ecommerce-api/package.json
COPY package-lock.json /var/www/nest-ecommerce-api/package-lock.json

# grant a permission to the application
RUN chown -R demo:demo /var/www/nest-ecommerce-api
USER demo

# clear application caching
RUN npm cache clean --force
# install all dependencies
RUN npm install

EXPOSE 7001
# start run in production environment

#CMD [ "npm", "run", "pm2:delete" ]
#CMD [ "npm", "run", "build-docker:dev" ]

# start run in development environment
CMD [ "npm", "run", "start:dev" ]