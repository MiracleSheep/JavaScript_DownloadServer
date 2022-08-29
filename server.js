const express = require('express')
const formidable = require('formidable')
const FilePond = require('filepond')
const app = express()
const port = 5500
var env = require('dotenv').config();
const fs = require('fs')
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post("/upload", function(req, res){
    console.log("start /upload");

    const form = formidable({ multiples: false });
  
    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      console.log(files)
      let theFile = files.filepond.filepath;
      console.log("theFile: " + theFile);
  
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(theFile);
    });  
  })

app.post("/save", function(req, res){
    console.log("start /save");
    console.log(`req: ${JSON.stringify(req.body)}`);
    let fileData = fs.readFileSync(req.body.filepond);
    console.log(fileData)
    fs.writeFileSync(fileData)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

