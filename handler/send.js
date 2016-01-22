"use strict";

var errorCodes = require('../errorCodes');

/**
 * 处理send指令
 * @this RTCClient
 * @param {*} msg
 * @returns Promise
 */
function handler(msg) {
    var toId = msg['to'];

    if (!Number.isSafeInteger(toId)) {
        return Promise.reject(errorCodes.ERR_ILLEGAL);
    }

    if (this.room === null) {
        return Promise.reject(errorCodes.ERR_CLIENT_NOT_INROOM);
    }

    var client = this.room.client(toId);
    if (!client) {
        return Promise.reject(errorCodes.ERR_CLIENT_NOT_EXISTS);
    }

    try {
        client.send("message", {
            from: this.id,
            isBroadcast: false,
            time: Date.now(),
            content: msg.content
        });
    } catch (ex) {
        return Promise.reject(errorCodes.ERR_CLIENT);
    }
    return Promise.resolve();
}

module.exports = exports = handler;