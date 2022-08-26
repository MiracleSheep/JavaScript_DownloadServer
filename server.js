//getting the node modules
//express is responsible for setting up the webserver
const express = require("express");

//this helps to access environment files
var env = require('dotenv').config();

//filepond is responsible for the file upload
const filePond = require("filepond")
//formidable is responsible for receiving the file
const formidable = require('formidable');
const app = express();
app.use(express.urlencoded({ extended: true }));
console.log("started");

app.get('/', (req, res) => {
    console.log("get triggereed")
    res.sendFile(__dirname+'/index.html')
});

app.get('/home', (req,res) => {
    res.sendFile(__dirname+'/index.html')
})

//This is waiting for an upload request for the files
app.post('/upload', function(req, res){
    const form = formidable({ multiples: false });

    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      let theFile = process.env.FILE_DESTINATION
  
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(theFile);
    })
})


//listening on this port for a connection
app.listen(process.env.NODE_LOCAL_PORT);

