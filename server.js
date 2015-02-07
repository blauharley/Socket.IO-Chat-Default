var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var exec = require('child_process').exec;

app.listen(8001);

function handler (req, res) {

  fs.readFile(__dirname + '/index.html',

  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });

}

var rooms = {};
var maxPers = 4;

io.on('connection', function (socket) {

  socket.on('init', function (data) {

    var guestAccepted = false;

    var roomhash = data.hash;
    var room = rooms[roomhash];

    if(!room){
      room = {};
      room.clients = [];
      rooms[roomhash] = room;
    }

    if(room.clients.length < maxPers){

       this.join(roomhash);
       socket._roomHash = roomhash;

       socket.on(roomhash, function(data){
         console.log(data);
         broadcastMsgByRoomHash(rooms, this, roomhash, data);

       });

       room.clients.push(this);

       broadcastMsgToAll(rooms, this, 'notify', {}, true);

       guestAccepted = true;

    }

    socket.emit('init', { rooms: getUpdateRooms(rooms), acc: guestAccepted  });

    /*
    exec('touch my-file'+counter+'.txt', function (error, stdout, stderr) {

        console.log(error);
        counter++;

    });
    */

  });

  socket.on('disconnect', function (data) {

    var room = rooms[this._roomHash];
    if(room){
        room.clients.splice(room.clients.indexOf(this),1);
        console.log(room.clients.length);
        broadcastMsgToAll(rooms, this, 'notify', {}, true);
    }

  });

});

function getUpdateRooms(rooms){

  var sentRooms = [];

  for(var hash in rooms){
    var sentRoom = {};
    sentRoom.hash = hash;
    sentRoom.num = rooms[hash].clients.length;
    sentRooms.push(sentRoom)
  }

  return sentRooms;

}

function broadcastMsgByRoomHash(rooms,sentClient,event, data, roomUpdate){

     var roomhash = data.hash;
     var msg = data.msg;

     var room = rooms[roomhash];

     room.clients.forEach(function(client){
        if(sentClient !== client){

          if(roomUpdate){
            client.emit(event, { rooms: getUpdateRooms(rooms) });
          }
          else{
            client.emit(event, { msg: msg });
          }

        }
     });

}

function broadcastMsgToAll(rooms,sentClient,event, data, roomUpdate){

     var msg = data.msg;

     for(var hash in rooms){

       var room = rooms[hash];

       room.clients.forEach(function(client){
          if(sentClient !== client){

            if(roomUpdate){
              client.emit(event, { rooms: getUpdateRooms(rooms) });
            }
            else{
              client.emit(event, { msg: msg });
            }

          }
       });

     }

}
