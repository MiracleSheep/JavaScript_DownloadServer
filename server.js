//importing modules and configuring them
const express = require('express')
const formidable = require('formidable')
const FilePond = require('filepond')
const app = express()
const port = 5500
var env = require('dotenv').config();
const fs = require('fs')
app.use(express.urlencoded({ extended: true }));

//this variable is an associative array responsible for holding the original names of downloaded files
const fileMapping = {};



//This is the home page of the website
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

//this post request is called when the user puts a files in the file dropbox
app.post("/upload", function(req, res){


    //using the formidable module to parse
    const form = formidable({ multiples: false });
  
    //parsing
    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      //getting the file path for the temp file
      let theFile = files.filepond.filepath;
      console.log("theFile: " + theFile);
  
      //returning to the browser that the file has been uploaded
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(theFile);

      //saving the original file name
      fileMapping[files.filepond.filepath] = files.filepond.originalFilename;
      console.log("Currently Saved File Mappings: " + JSON.stringify(fileMapping));

    });  
  })


//this function is meant to save the file and rename it to it's original name
function saveFile(theFilePondName) {
  console.log("Saving " + theFilePondName + " as /Downloads/" + fileMapping[theFilePondName]);
  let fileData = fs.readFileSync(theFilePondName);
  fs.writeFileSync('/Downloads/' + fileMapping[theFilePondName],fileData)
  delete fileMapping[theFilePondName];
}

//this post request is responsible for moving the temp file to a more permanent place and giving it back it's name
app.post("/save", function(req, res){
   console.log(`filePondRequest: ${filePondRequest}`);
   console.log("TypeOf " + typeof filePondRequest);
  let filePondRequest = req.body.filepond;
  //bootleg way of checking if the object returned is multiple files or just one
  if( typeof filePondRequest === 'object' && filePondRequest !== null) {
    //for loop to save the file multiple times
    for(const property in filePondRequest) {
     console.log(`${property}: ${filePondRequest[property]}`);
     saveFile(filePondRequest[property]);
    }
  } else {
    //saving he file
     saveFile(filePondRequest);
  }
  console.log("Remaining Saved File Mappings: " + JSON.stringify(fileMapping));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

