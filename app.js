const app = require('express')();
const httpServer = require('http').createServer(app);
var fs = require("fs");

const port = process.env.PORT || 3000;

app.get('/listUsers', function (req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       res.end( data );
    });
 })

 httpServer.listen(port, () => console.log(`listening on port ${port}`));