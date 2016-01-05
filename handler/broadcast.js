"use strict";

//noinspection JSUnusedLocalSymbols
var errorCodes = require('../errorCodes');

/**
 * 处理broadcast消息
 * @this RTCClient
 * @param {*} msg
 * @returns Promise
 */
function handleBroadcast(msg) {
    //当前用户不在房间中
    if (this.room === null) {
        return Promise.reject(errorCodes.ERR_CLIENT_NOT_INROOM);
    }

    var sendData = {
        from: this.id,
        isBroadcast: true,
        time: Date.now(),
        content: msg.content
    };
    //保存广播消息，query_broadcast时会用到
    this.room.broadcasts.push(sendData);
    this.room.broadcast(sendData);

    return Promise.resolve();
}

module.exports = exports = handleBroadcast;