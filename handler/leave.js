"use strict";

var errorCodes = require('../errorCodes');

/**
 * 处理leave指令
 * @this RTCClient
 * @param {*} msg
 * @returns Promise
 */
function handler(msg) {
    //当前用户不在房间中
    if (this.room === null) {
        return Promise.reject(errorCodes.ERR_CLIENT_NOT_INROOM);
    }

    try {
        this.room.quit(this);
    } catch (ex) {
        return Promise.reject(ex);
    }
    return Promise.resolve();
}

module.exports = exports = handler;