const app = require('express')();
const httpServer = require('http').createServer(app);
var fs = require("fs");
const io = require('socket.io')(httpServer, {
    cors: {origin : '*'}
  });

const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       res.end( data );
    });
 })

 io.on('connection', (socket) => {
    console.log('a user connected');
  
    socket.on('message', (message) => {
      console.log(message);
      // socket.broadcast.to('ID').emit( 'send msg', {somedata : somedata_server} );
      io.emit('message', `${socket.id}: ${message}`);
    });
  
    socket.on('disconnect', () => {
      console.log('a user disconnected!');
    });
  });

 httpServer.listen(port, () => console.log(`listening on port ${port}`));