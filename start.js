//Load utils at first
global.utils = require('./utils');

//Load other requirements
var HttpsServer = require('https').Server,
    WebSocketServer = require('ws').Server,
    RTCClient = require('./RTCClient'),
    RoomManager = require('./room/manager');

/**
 * @type {RoomManager}
 */
global.roomManager = new RoomManager();

var wss = new WebSocketServer({
    port: 8089
});

wss.on('connection', function (ws) {
    RTCClient.bind(ws);
});
