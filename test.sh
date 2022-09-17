#!/bin/bash

docker stop dserver
docker rm dserver

docker build -t downloadserver .

docker run -d -p 5500:5500 --name dserver downloadserver

docker logs -f dserver
