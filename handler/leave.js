"use strict";

var errorCodes = require('../errorCodes');

/**
 * 处理broadcast消息
 * @this RTCClient
 * @param {*} msg
 */
function handleLeave(msg) {
    //当前用户不在房间中
    if (this.room === null) {
        this.replyError(msg, errorCodes.ERR_CLIENT_NOT_INROOM, "You are not in a room");
        return;
    }
    try {
        this.room.quit(this);
    } catch (ex) {
        this.replyError(msg, errorCodes.ERR_CLIENT, "Some errors occurred during the delivery message.");
    }
}

module.exports = exports = handleLeave;