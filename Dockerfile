FROM node:16

ENV TZ=America/New_York

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create app directory
WORKDIR /usr/src/app

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


EXPOSE ${NODE_LOCAL_PORT}


CMD [ "node", "server.js" ]
