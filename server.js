const http=require('http');
const fs=require('fs');

const WebApp = require('./webapp.js');

const app=WebApp.create();

const PORT=9000;
const server=http.createServer(app);
server.listen(PORT);
console.log(`listening to the port ${PORT}`);
