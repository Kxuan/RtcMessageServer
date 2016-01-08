"use strict";

var errorCodes = require('../errorCodes');

/**
 * 处理broadcast消息
 * @this RTCClient
 * @param {*} msg
 * @returns Promise
 */
function handleLeave(msg) {
    //当前用户不在房间中
    if (this.room === null) {
        return Promise.reject(errorCodes.ERR_CLIENT_NOT_INROOM);
    }

    var info;
    try {
        info = this.room.info();
    } catch (ex) {
        return Promise.reject(errorCodes.ERR_ROOM);
    }
    this.send("room", info);
    return Promise.resolve();
}

module.exports = exports = handleLeave;