const app = require('express')();
const httpServer = require('http').createServer(app);
var fs = require("fs");
const io = require('socket.io')(httpServer, {
    cors: {origin : '*'}
  });

const port = process.env.PORT || 3000;
users1 = new Map();

app.get('/:id',function(req,res){
  var id = req.params['id'] 
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    JSON.parse(data).forEach(element => {
      if(element.id==id)
      res.json(element)
    });

  });
});

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
        io.to(users1.get(data.toId.toString())).emit('message', data);
        // users1.get(data.toId).emit('message', {"fromId":data.fromId,"message": data.message});
    });
  
    socket.on('disconnect', () => {
      for (let [key, value] of users1.entries()) {
        if (value === socket.id){
          console.log('user '+ key +' disconnected');
          users1.delete(key);
        }
        
      }

      io.emit('connection', [...users1.keys()]);
    });
  });

 httpServer.listen(port, () => console.log(`listening on port ${port}`));