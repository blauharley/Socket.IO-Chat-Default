/*
    this package requires socket.io to work properly
 */
function ChatRoomManagerClient(opts){

    var singleton = this;
    ChatRoomManagerClient = function(){
        return singleton;
    };

    this._roomHash = opts.roomHash || "";

    this._roomArea = document.querySelector(opts.roomArea);
    this._msgArea = document.querySelector(opts.msgArea);

    this._socket = io.connect(opts.localhost);

    this._clientName = opts.clientName || "";

    this._hashHandler = opts.hashHandler;

    if(!this._roomHash && !this._hashHandler){
        throw new Error("ChatRoomManagerClient Error: neither roomHash nor roomHandler provided!");
    }

    this._socket.on('init', function(data){

        if(data.acc){
            this._socket.on(this._roomHash, function (data) {
                this._receiveHandler(data,this._msgArea);
            }.bind(this));
            if(this._updateRAHandler)this._updateRAHandler(data,this._roomArea);
            if(this._updateHHandler)this._updateHHandler(data.history,this._msgArea);
            if(this._validHashHandler)this._validHashHandler(this._roomHash);
        }
        else{
            if(this._hashHandler)this._roomHash = this._hashHandler();
            this._socket.emit('init', { hash: this._roomHash });
        }

    }.bind(this));

    this._socket.emit('init', { hash: this._roomHash });

}

ChatRoomManagerClient.prototype.updateRoomArea = function(handler){
    this._updateRAHandler = handler;
    this._socket.on('notify', function(data){
        this._updateRAHandler(data,this._roomArea);
    }.bind(this));
};

ChatRoomManagerClient.prototype.updateHistory = function(handler){
    this._updateHHandler = handler;
};

ChatRoomManagerClient.prototype.validHash = function(handler){
    this._validHashHandler = handler;
};

ChatRoomManagerClient.prototype.receive = function(handler){
    this._receiveHandler = handler;
};

ChatRoomManagerClient.prototype.messageTo = function(msg){
    this._socket.emit(this._roomHash,{ hash:this._roomHash, msg: msg, clientName: this._clientName });
};