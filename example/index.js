'use strict';

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.of('/chat').use( require('../')() );

http.listen(3000, function(){
  console.log('listening on *:3000');
});
