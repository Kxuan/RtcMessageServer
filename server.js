var fs = require('fs'),
    debug = require('debug')("server"),
    WebSocketServer = require('ws').Server,
    RTCClient = require('./RTCClient'),
    RoomManager = require('./room/manager');

var server;

if (config.server.https) {
    var https = require('https');
    server = https.createServer({
        key: fs.readFileSync(config.server.key),
        cert: fs.readFileSync(config.server.cert),
        ca: config.server.ca.map(fs.readFileSync.bind(fs)),

        requestCert: false,
        handshakeTimeout: config.server.handshakeTimeout || 10000,
        rejectUnauthorized: false
    });
} else {
    var http = require('http');
    server = http.createServer();
}

var wss = module.exports = exports =
    new WebSocketServer({
        server: server
    });

wss.on('connection', RTCClient.assign.bind(RTCClient));

/**
 * Initialize room manager
 *
 * @type {RoomManager}
 **/
global.roomManager = new RoomManager();


server.listen(config.server.listen, function () {
    var serverAddress = server.address();

    debug("listen %s", JSON.stringify(serverAddress));
});
