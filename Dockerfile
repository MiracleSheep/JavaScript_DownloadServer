FROM node:16

ENV TZ=America/New_York

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create app directory
WORKDIR /usr/src/app

#create a directory for the downloads folder
RUN mkdir -p /usr/src/app/Downloads


# Install app dependencies
COPY package*.json ./

#installing modules
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

#creating a docker volume
VOLUME ${FILE_DESTINATION}:${FILE_DESTINATION}

# Bundle app source
COPY . .

#This adds a waiting functionality for the sql database to start
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait


EXPOSE ${NODE_LOCAL_PORT}


CMD [ "node", "server.js" ]
