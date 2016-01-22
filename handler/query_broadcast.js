"use strict";

//noinspection JSUnusedLocalSymbols
var errorCodes = require('../errorCodes');

/**
 * 处理query_broadcast指令
 * @this RTCClient
 * @param {*} msg
 * @returns Promise
 */
function handler(msg) {
    //当前用户不在房间中
    if (this.room === null) {
        return Promise.reject(errorCodes.ERR_CLIENT_NOT_INROOM);
    }
    var self = this;
    this.room.broadcasts.forEach(function (data) {
        self.send("message", data);
    });
    return Promise.resolve();
}

module.exports = exports = handler;