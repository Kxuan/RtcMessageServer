"use strict";

var errorCodes = require('../errorCodes');

/**
 * 处理send消息
 * @this RTCClient
 * @param {*} msg
 * @returns Promise
 */
function handleCandidate(msg) {
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
        client.send("candidate", {
            from: this.id,
            time: Date.now(),
            content: msg.content
        });
    } catch (ex) {
        return Promise.reject(ex);
    }
    return Promise.resolve();
}

module.exports = exports = handleCandidate;