FROM dockerfile/nodejs

RUN git clone https://github.com/authyhack/server.git
WORKDIR server
RUN npm install
