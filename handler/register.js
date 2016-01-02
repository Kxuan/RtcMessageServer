"use strict";

var errorCodes = require('../errorCodes');

/**
 *
 * @this RTCClient
 * @param {*} msg
 */
function handleRegister(msg) {
    var isIdSettingByNow = false;
    var roomId = msg['roomid'],
        clientId = msg['clientid'];

    if (!Number.isSafeInteger(roomId) || !Number.isSafeInteger(clientId)) {
        this.replyError(msg, errorCodes.ERR_ILLEGAL, "roomid & clientid must be an integer.");
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

    //当前用户还没有ID，使用客户端提供的ID
    if (this.id === null) {
        this.id = clientId;
        isIdSettingByNow = true;
    } else if (this.id != clientId) {
        this.replyError(msg, errorCodes.ERR_ILLEGAL, "You can not change your clientid.");
        return;
    }
    this.device = msg.device;

    try {
        room.join(this);
    } catch (ex) {
        this.replyError(msg, errorCodes.ERR_ROOM, "Fail on join to room. (%s)", ex.message);
        console.error(ex);
        if (this.room) {
            this.room.quit(this);
        }
        if (isIdSettingByNow) {
            this.id = null;
        }
    }
}

module.exports = exports = handleRegister;