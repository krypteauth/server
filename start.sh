#!/bin/bash

sudo docker run --name mongo -d -P dockerfile/mongodb mongod
sudo docker run -d -p 80:5000 --link mongo:mongo izqui/krypte