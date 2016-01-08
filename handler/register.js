"use strict";

var errorCodes = require('../errorCodes');

/**
 *
 * @this RTCClient
 * @param {*} msg
 * @returns Promise
 */
function handleRegister(msg) {
    var isIdSettingByThisHandler = false;
    var roomId = msg['roomid'],
        clientId = msg['clientid'];

    if (!Number.isSafeInteger(roomId) || !Number.isSafeInteger(clientId)) {
        return Promise.reject(errorCodes.ERR_ILLEGAL_ARGUMENTS);
    }
    if (this.room !== null) {
        return Promise.reject(errorCodes.ERR_CLIENT_INROOM);
    }

    var room = roomManager.room(roomId);
    if (room.isFull()) {
        return Promise.reject(errorCodes.ERR_ROOM_FULL);
    }

    //当前客户端还没有ID，使用客户端提供的ID，如果当前客户端已有ID，则验证两个ID是否相同
    if (this.id === null) {
        this.id = clientId;
        isIdSettingByThisHandler = true;
    } else if (this.id != clientId) {
        return Promise.reject(errorCodes.ERR_ILLEGAL);
    }
    this.device = msg.device;

    try {
        room.join(this);
    } catch (ex) {
        if (this.room) {
            this.room.quit(this);
        }
        if (isIdSettingByThisHandler) {
            this.id = null;
        }

        return Promise.reject(errorCodes.ERR_ROOM);
    }
    return Promise.resolve(this.room.info());
}

module.exports = exports = handleRegister;