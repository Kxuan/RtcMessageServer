"use strict";

//noinspection JSUnusedLocalSymbols
var errorCodes = require('../errorCodes');

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

    var hasError = false;
    var allClients = this.room.clients;
    var sendData = {
        from: this.id,
        isBroadcast: true,
        time: Date.now(),
        content: msg.content
    };
    this.room.broadcasts.push(sendData);
    for (var id in allClients) {
        if (id === this.id)
            continue;
        try {
            allClients[id].send("message", sendData);
        } catch (ex) {
            hasError = true;
        }
    }
    if (hasError) {
        this.replyError(msg, errorCodes.ERR_CLIENT, "Some errors occurred during the delivery message.");
    }
}

module.exports = exports = handleBroadcast;