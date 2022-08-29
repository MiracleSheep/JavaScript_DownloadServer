# Javascript_DownloadServer

## Description

This is a webserver I made to send files to a server. 
Features include:
* A website with a spot to drag and drop files

## How to set up

### Requirements
* Docker
* That is pretty much it

### Instructions
1. Git clone the repo ``git clone https://github.com/MiracleSheep/JavaScript_DownloadServer.git``
4. Modify the .env file inside of the container to suit your needs
5. Build the image in the directory with ``docker build -t downloadserver .``
6. Run the image ``docker run -d -p <yourport>:<yourport> --name [insert name here] downloadserver``
7. Enjoy!
