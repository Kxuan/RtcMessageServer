"use strict";

var errorCodes = require('../errorCodes');

/**
 * 处理offer消息
 * @this RTCClient
 * @param {*} msg
 * @returns Promise
 */
function handleOffer(msg) {
    var toId = msg['to'];

    if (!Number.isSafeInteger(toId)) {
        return Promise.reject(errorCodes.ERR_ILLEGAL);
    }

    if (this.room === null) {
        return Promise.reject(errorCodes.ERR_CLIENT_NOT_INROOM);
    }

    var toClient = this.room.client(toId);
    if (!toClient) {
        return Promise.reject(errorCodes.ERR_CLIENT_NOT_EXISTS);
    }

    try {
        toClient.send("offer", {
            from: this.id,
            time: Date.now(),
            isHelper: !!msg.isHelper,
            content: msg.content
        });
    } catch (ex) {
        return Promise.reject(errorCodes.ERR_CLIENT);
    }
    return Promise.resolve();
}

module.exports = exports = handleOffer;