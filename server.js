const http=require('http');
const app=require('./app.js');

const PORT=9000;
const server=http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT);
console.log(`listening to the port ${PORT}`);
