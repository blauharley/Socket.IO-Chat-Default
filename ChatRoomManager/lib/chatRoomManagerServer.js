function ChatRoomManagerServer(opts){

    var singleton = this;
    ChatRoomManagerServer = function(){
        return singleton;
    };

    this._rooms = {};
    this._maxGuests = opts.maxGuests || 5;

    if(!opts.io){
        throw new Error("ChatRoomManagerServer option io is not defined");
    }
    this._io = opts.io;

    var instance = this;

    this._io.on('connection', function (socket) {

        socket.on('init', function (data) {

            var socket = this;
            var guestAccepted = false;

            var roomhash = data.hash;
            if(!roomhash){
                socket.emit('init', { rooms: [], acc: guestAccepted, history: ""  });
                return;
            }

            var room = instance._rooms[roomhash];

            if(!room){
                room = {};
                room.clients = [];
                room.history = [];
                instance._rooms[roomhash] = room;
            }

            if(room.clients.length < instance._maxGuests){

                this.join(roomhash);
                socket._roomHash = roomhash;

                socket.on(roomhash, function(data){
                    var room = instance._rooms[data.hash];
                    room.history.push(data.msg);
                    instance._broadcastMsgByRoomHash(this, data.hash, data);
                });

                room.clients.push(socket);

                instance._broadcastMsgToAll(socket, 'notify', {}, true);

                guestAccepted = true;

            }

            socket.emit('init', { rooms: instance._getUpdateRooms(), acc: guestAccepted, history: room.history  });

        });

        socket.on('disconnect', function (data) {

            var socket = this;
            var roomHash = socket._roomHash;
            var room = instance._rooms[roomHash];
            if(room){
                room.clients.splice(room.clients.indexOf(socket),1);
                if(!room.clients.length){
                    delete instance._rooms[roomHash];
                }
                instance._broadcastMsgToAll(socket, 'notify', {}, true);
            }

        });

    });
}

ChatRoomManagerServer.prototype.getRooms = function(){ return this._rooms; };

ChatRoomManagerServer.prototype._getUpdateRooms = function(){

    var sentRooms = [];

    for(var hash in this._rooms){
        var sentRoom = {};
        sentRoom.hash = hash;
        sentRoom.num = this._rooms[hash].clients.length;
        sentRooms.push(sentRoom)
    }

    return sentRooms;

};

ChatRoomManagerServer.prototype._broadcastMsgByRoomHash = function(sentClient,event, data, roomUpdate){

    var roomhash = data.hash;
    var msg = data.msg;

    var instance = this;
    var room = instance._rooms[roomhash];

    room.clients.forEach(function(client){
        if(sentClient !== client){

            if(roomUpdate){
                client.emit(event, { rooms: instance._getUpdateRooms(), history: room.history });
            }
            else{
                client.emit(event, { msg: msg });
            }

        }
    });

};

ChatRoomManagerServer.prototype._broadcastMsgToAll = function(sentClient,event, data, roomUpdate){

    var msg = data.msg;
    var roomInfo = this._getUpdateRooms();

    for(var hash in this._rooms){

        var room = this._rooms[hash];

        room.clients.forEach(function(client){
            if(sentClient !== client){

                if(roomUpdate){
                    client.emit(event, { rooms: roomInfo });
                }
                else{
                    client.emit(event, { msg: msg });
                }

            }
        });

    }

};

module.exports = ChatRoomManagerServer;