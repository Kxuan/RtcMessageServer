"use strict";

var utils = require('../utils'),
    errorCodes = require('../errorCodes');

/**
 *
 * @this RTCClient
 * @param {*} msg
 */
function handleRegister(msg) {
    var roomId = msg['roomid'],
        clientId = msg['clientid'];

    if (!utils.isInteger(roomId) || !utils.isInteger(clientId)) {
        this.replyError(msg, errorCodes.ERR_ILLEGAL, "roomid & clientid must be an integer.");
        return;
    }

    //当前用户还没有ID，使用客户端提供的ID
    if (this.id === null) {
        this.id = clientId;
    } else if (this.id != clientId) {
        this.replyError(msg, errorCodes.ERR_ILLEGAL, "You can not change your clientid.");
        return;
    }

    if (this.room !== null) {
        this.replyError(msg, errorCodes.ERR_CLIENT_INROOM, "You must quit from the room");
        return;
    }

    var room = roomManager.room(roomId);
    if (room.isFull()) {
        this.replyError(msg, errorCodes.ERR_ROOM_FULL, "Room is full");
        return;
    }

    try {
        room.join(this);
    } catch (ex) {
        this.replyError(msg, errorCodes.ERR_ROOM, "Fail on join to room. (%s)", ex.message);
        return;
    }

    this.reply(msg, 'enter', room.info());
}

module.exports = exports = handleRegister;