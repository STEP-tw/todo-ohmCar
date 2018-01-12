const http=require('http');
const fs=require('fs');

const WebApp = require('./webapp.js');

const app=WebApp.create();

const headers={
  ".jpg":"img/jpg",
  ".html":"text/html",
  ".css":"text/css",
  ".js":"text/javascript",
  ".gif":"img/gif",
  ".pdf":"text/pdf"
};

let registeredUsers=[
  {username:'omkar',password:'omkar'},
  {username:'ketan',password:'ketan'}
];

const doesExist=req=>{
  return fs.existsSync('./public'+req.url);
}

const setHeader=function(req,res){
  let file=".."+req.url;
  let extensionOfFile=file.slice(file.lastIndexOf("."));
  res.setHeader("Content-type",headers[extensionOfFile]);
};

const serveFile=function(req,res){
  try {
    if(doesExist(req)){
      setHeader(req,res);
      res.write(fs.readFileSync('./public'+req.url));
      res.end();
    }
  } catch (e) {
    return e;
  }
}

app.use(serveFile);

const PORT=9000;
const server=http.createServer(app);
server.listen(PORT);
console.log(`listening to the port ${PORT}`);
