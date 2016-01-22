"use strict";

var errorCodes = require('../errorCodes');

/**
 * 处理answer指令
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
        client.send("answer", {
            from: this.id,
            time: Date.now(),
            accept: !!msg.accept,
            content: msg.content
        });
    } catch (ex) {
        return Promise.reject(ex);
    }

    return Promise.resolve();
}

module.exports = exports = handler;