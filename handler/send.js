"use strict";

var errorCodes = require('../errorCodes');

/**
 * 处理send消息
 * @this RTCClient
 * @param {*} msg
 */
function handleSend(msg) {
    var toId = msg['to'];

    if (!Number.isSafeInteger(toId)) {
        this.replyError(msg, errorCodes.ERR_ILLEGAL, "'to' must be an integer.");
        return;
    }

    if (this.room === null) {
        this.replyError(msg, errorCodes.ERR_CLIENT_NOT_INROOM, "You must enter a room");
        return;
    }

    var client = this.room.client(toId);
    if (!client) {
        this.replyError(msg, errorCodes.ERR_CLIENT_NOT_EXISTS, "Client not in room");
        return;
    }

    try {
        client.send("message", {
            from: this.id,
            isBroadcast: false,
            time: Date.now(),
            content: msg.content
        });
    } catch (ex) {
        this.replyError(msg, errorCodes.ERR_CLIENT, "Fail to send message. (%s)", ex.message);
    }
}

module.exports = exports = handleSend;