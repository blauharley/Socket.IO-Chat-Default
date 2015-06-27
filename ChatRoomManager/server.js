var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var port = 8001;

// @import chatroommanager server lib
var chatRoomManagerServer = require('./lib/chatRoomManagerServer');

app.listen(port);

function handler (req, res) {

    fs.readFile(__dirname + '/index.html',

        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading chatroommanger.html');
            }

            res.writeHead(200);
            res.end(data);
        });

}

// @info: initialize server instance
var instance = new chatRoomManagerServer({
    io: io,
    maxGuests: 4
});


