"use strict";
var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    errCodes = require("./errorCodes"),
    handlers = require('./handler');

var $ws = Symbol("Private WebSocket");

class RTCClient extends EventEmitter {
    /*
     * Bind RTCClient to WebSocket
     *
     * @param {WebSocket} ws
     * @returns {RTCClient}
     */
    static bind(ws) {
        var client = new this(ws);

        ws.rtc = client;
        client.once('close', function (stillAvailable) {
            delete ws.rtc;
        });

        return client;
    }

    /**
     *
     * @param {WebSocket} socket
     */
    constructor(socket) {
        super();
        this[$ws] = socket;
        /** @type null|int */
        this.id = null;
        /** @type null|Room */
        this.room = null;

        socket.once('close', function () {
            this.emit('close', false);
        }.bind(this));
        socket.on('error', this.emit.bind(this, 'error'));

        socket.on('message', function (msg) {
            var fn = handlers[msg.cmd];
            if (typeof(fn) === 'function') {
                try {
                    fn.call(this, msg);
                } catch (ex) {
                    this.error(errCodes.ERR_UNKNOWN_ERROR, ex.message);
                }
            } else {
                this.error(errCodes.ERR_UNKNOWN_COMMAND, "Unknown command %s", msg.cmd);
            }
        }.bind(this));
    }

    send(type, data) {
        var ws = this[$ws];
        if (typeof type === "string") {
            if (data !== undefined) {
                ws.send(JSON.stringify({
                    type: type,
                    data: data
                }));
            } else {
                ws.send(type);
            }
        } else {
            return ws.send(JSON.stringify(type));
        }
    }

    replyError(originMsg, code) {
        var msg = util.format.apply(util, Array.prototype.slice.call(arguments, 2));

        this.send({
            dialogId: originMsg && originMsg.dialogId|| undefined,
            type: "error",
            code: code,
            message: msg
        });
    }

    reply(originMsg, type, data) {
        return this.send({
            dialogId: originMsg && originMsg.dialogId || undefined,
            type: type,
            data: data
        });
    }
}

module.exports = exports = RTCClient;
