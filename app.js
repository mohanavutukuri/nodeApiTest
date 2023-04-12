const app = require('express')();
const httpServer = require('http').createServer(app);
var fs = require("fs");
const io = require('socket.io')(httpServer, {
    cors: {origin : '*'}
  });

const port = process.env.PORT || 3000;
users1 = new Map();
var users=new Array();

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

    socket.on('connection',(user)=>{
        users.push(user);
        console.log('user '+user.id+ ' connected');
        users1.set(user.id,socket.id);
        io.emit('connection', users);
    });
  
    socket.on('setnewTime',(data)=>{
      io.emit("newtime",data);
    })

    socket.on("togglePlay",(data)=>{
      io.emit("toggle",data);
    })
    socket.on('message', (data) => {
      io.emit('message', data);
        // io.to(users1.get(data.toId.toString())).emit('message', data);
        // users1.get(data.toId).emit('message', {"fromId":data.fromId,"message": data.message});
    });
  
    socket.on('disconnect', () => {
      for (let [key, value] of users1.entries()) {
        if (value === socket.id){
          users=users.filter((data)=>{
            return key!=data.id;
          });
          console.log('user '+ key +' disconnected');
          users1.delete(key);
        }
        
      }

      io.emit('connection', users);
    });
  });

 httpServer.listen(port, () => console.log(`listening on port ${port}`));