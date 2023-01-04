/******************************************************************************************************
*                                                                                                     *
*                                         For Micah:                                                  *
*   This is the backend of the webserver. No touchie. Unless you already know what you want to do.    *
*                                                                                                     *
*******************************************************************************************************/


//importing modules and configuring them
const express = require('express')
const formidable = require('formidable')
const FilePond = require('filepond')
const app = express()
const port = 5500
var env = require('dotenv').config();
const fs = require('fs')
var mysql = require('mysql2');
const path = require('path');
var session = require('express-session');
//this variable is an associative array responsible for holding the original names of downloaded files
const fileMapping = {};
app.use(express.urlencoded({ extended: true }));

//view engine to ejs
app.set('view engine', 'ejs');

//this is relevant to the user session.
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
  database: process.env.MYSQL_DATABASE
});  


//This is a route that can be used consistently to fetch data from the credentials table
app.get('/users', function(req, res, next) {
  //sending a query to use the correct database
  con.query("USE serverdb" , function (err, result) {
    if (err) throw err;
  });
  con.query('SELECT * FROM credentials', function (err, data, fields) {
  if (err) throw err;
  res.render('users', { title: 'User List', userData: data});
});
});

//This is a route that can be used consistently in order to fetch data from the file table
app.get('/files', function(req, res, next) {
  //sending a query to use the correct database
  con.query("USE serverdb" , function (err, result) {
    if (err) throw err;
  });
  con.query('SELECT * FROM files', function (err, data, fields) {
  if (err) throw err;
  res.render('files', { title: 'File List', userData: data});
});
});

//this is the homepage of the website
app.get('/', (req, res) => {



})

//This is the filedrop page of the website
app.get('/filedrop', (req, res) => {
    res.sendFile(__dirname + '/views/filedrop.html');
})

//this post request is used for the authentication of users.
// This is the authentication function that receives info from the form
app.post('/auth', (req, res) => {
  //getting the password and username from the form
  var username = req.body.username;
  var password = req.body.password;

    //sending a query to use the correct database
    con.query("USE serverdb" , function (err, result) {
                if (err) throw err;
              });
    //sending a query to check if the username and password are present.
    con.query("SELECT * FROM credentials WHERE username = ? AND password = ?", [username,password], function (err, result) {
      if (err) throw err;
    
      console.log("results: " + result )
      
      //checking if there are more than 0 username/passwords matching (the reason I can do this without being worried about duplicates showing up is because the database only allows for unique usernames)
    if (result.length > 0) {
      //setting the status of the user to logged in
      req.session.loggedin = true;
      //logging the username in the session - this will help to track who uploads what files. maybe I can even add log in times for users so micah can track. idk.
      req.session.username = username;
      res.redirect('/access');
    } else {
      res.redirect('/denied');
    }			
    

  });

  });  

//this post request is called when the user puts a files in the file dropbox
app.post("/upload", function(req, res){
  if (req.session.loggedin) {

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
  }
  })


//this function is meant to save the file and rename it to it's original name
function saveFile(theFilePondName) {
  console.log("Saving " + theFilePondName + " as /Downloads/" + fileMapping[theFilePondName]);
  //reading the filedata and turning it into a buffer
  let fileData = fs.readFileSync(theFilePondName);
  //getting the stats of the file
  let filestats = fs.statSync(theFilePondName)
  //writting the file data do the downloads folder
  fs.writeFileSync('/usr/src/app/Downloads/' + fileMapping[theFilePondName],fileData)
  //making a request to the database to save your file.
  con.query("INSERT INTO files VALUES(? , ?, CURRENT_TIME ,CURRENT_DATE, ?)", [theFilePondName,filestats.size/ (1024*1024*1024), req.session.username], function (err, result) {
    if (err) { res.redirect('/') } else {}	
}) 

  delete fileMapping[theFilePondName];
}

//this post request is responsible for moving the temp file to a more permanent place and giving it back it's name
app.post("/save", function(req, res){

  //checking if the use has perms to be able to save
  if (req.session.loggedin) {

  //checking if the file can be saved
  let filePondRequest = req.body.filepond;
    if (filePondRequest != '') {
  console.log(`filePondRequest: ${filePondRequest}`);
  console.log("TypeOf " + typeof filePondRequest);
  console.log(filePondRequest)
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
    } else {res.redirect('/')}
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

