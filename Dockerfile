FROM dockerfile/nodejs

RUN git clone https://github.com/authyhack/server.git
WORKDIR server

RUN npm install
RUN npm -g install nodemon

EXPOSE 5000

ENTRYPOINT nodemon index.js