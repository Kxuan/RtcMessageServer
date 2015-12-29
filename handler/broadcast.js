"use strict";

//noinspection JSUnusedLocalSymbols
var utils = require('../utils'),
    errorCodes = require('../errorCodes');

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
    for (var id in allClients) {
        if (id === this.id)
            continue;
        try {
            allClients[id].send("message", {
                from: this.id,
                isBroadcast: true,
                msg: msg.msg
            });
        } catch (ex) {
            hasError = true;
        }
    }
    if (hasError) {
        this.replyError(msg, errorCodes.ERR_CLIENT, "Some errors occurred during the delivery message.");
    }
}

module.exports = exports = handleBroadcast;