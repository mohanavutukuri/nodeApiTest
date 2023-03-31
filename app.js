const app = require('express')();
const httpServer = require('http').createServer(app);
var fs = require("fs");
const io = require('socket.io')(httpServer, {
    cors: {origin : '*'}
  });

const port = process.env.PORT || 3000;
users1 = new Map();

app.get('/', function (req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       res.end( data );
    });
 })

 io.on('connection', (socket) => {

    socket.on('connection',(UserId)=>{
        console.log('user '+UserId+ ' connected');
        users1.set(UserId,socket.id);
        io.emit('connection', [...users1.keys()]);
    });
  

    socket.on('message', (data) => {
        io.to(users1.get(data.toId.toString())).emit('message', {"fromId":data.fromId,"message": data.message});
        // users1.get(data.toId).emit('message', {"fromId":data.fromId,"message": data.message});
    });
  
    socket.on('disconnect', () => {
      console.log('a user disconnected!');
    });
  });

 httpServer.listen(port, () => console.log(`listening on port ${port}`));