"use strict";

var utils = require('../utils'),
    errorCodes = require('../errorCodes');

/**
 * 处理offer消息
 * @this RTCClient
 * @param {*} msg
 */
function handleOffer(msg) {
    var toId = msg['to'];

    if (!utils.isInteger(toId)) {
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
        client.send("offer", {
            from: this.id,
            time: Date.now(),
            content: msg.content
        });
    } catch (ex) {
        this.replyError(msg, errorCodes.ERR_CLIENT, "Fail to send offer. (%s)", ex.message);
    }
}

module.exports = exports = handleOffer;