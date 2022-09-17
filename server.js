//importing modules and configuring them
const express = require('express')
const formidable = require('formidable')
const FilePond = require('filepond')
const app = express()
const port = 5500
var env = require('dotenv').config();
const fs = require('fs')
var mysql = require('mysql2');
var session = require('express-session');
//this variable is an associative array responsible for holding the original names of downloaded files
const fileMapping = {};
app.use(express.urlencoded({ extended: true }));

//this stores information related to the session
app.use(session({
	secret: process.env.SECRET,
	resave: true,
	saveUninitialized: true
}));

//This stores information relating to the connection to the database
var con = mysql.createPool({  
  host: process.env.MYSQL_HOST,  
  user: process.env.MYSQL_USERNAME,  
  password: process.env.MYSQL_ROOT_PASSWORD,
  port: process.env.MYSQL_LOCAL_PORT,
  database: "serverdb"
});  


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
  


      //saving the original file name
      fileMapping[files.filepond.filepath] = files.filepond.originalFilename;
      console.log("Currently Saved File Mappings: " + JSON.stringify(fileMapping));


            //returning to the browser that the file has been uploaded
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(theFile);

    });  
  })


//this function is meant to save the file and rename it to it's original name
function saveFile(theFilePondName) {
  console.log("Saving " + theFilePondName + " as /Downloads/" + fileMapping[theFilePondName]);
  let fileData = fs.readFileSync(theFilePondName);
  fs.writeFileSync('/usr/src/app/Downloads/' + fileMapping[theFilePondName],fileData)
  delete fileMapping[theFilePondName];
}

//this post request is responsible for moving the temp file to a more permanent place and giving it back it's name
app.post("/save", function(req, res){

  let filePondRequest = req.body.filepond;
  console.log(`filePondRequest: ${filePondRequest}`);
  console.log("TypeOf " + typeof filePondRequest);
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

