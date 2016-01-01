"use strict";

//noinspection JSUnusedLocalSymbols
var utils = require('../utils'),
    errorCodes = require('../errorCodes');

/**
 * 处理broadcast消息
 * @this RTCClient
 * @param {*} msg
 */
function handleBroadcast(msg) {
    //当前用户不在房间中
    if (this.room === null) {
        this.replyError(msg, errorCodes.ERR_CLIENT_NOT_INROOM, "You must enter a room");
        return;
    }
    var self = this;
    this.room.broadcasts.forEach(function (data) {
        self.send("message", data);
    });
}

module.exports = exports = handleBroadcast;