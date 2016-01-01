"use strict";
var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    errCodes = require("./errorCodes"),
    handlers = require('./handler');
var assert = require('assert');

var $ws = Symbol("WebSocket"),
    $wsCloseHandler = Symbol("WebSocket close event handler");

class RTCClient extends EventEmitter {
    /**
     * RTCClient close event
     *
     * @event RTCClient#close
     * @param {boolean} available If this value is false, send message to this client will cause an error.
     */

    /*
     * Bind RTCClient to WebSocket
     *
     * @param {WebSocket} ws
     * @returns {RTCClient}
     */
    static assign(ws) {
        var client = new this(ws);

        ws.rtc = client;
        client.once('close', function (available) {
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
        /** @type {null|int} Client Identity*/
        this.id = null;
        /** @type {null|Room} Which client room */
        this.room = null;
        /** @type {null|string} Which type, MobilePhone or Browser? */
        this.type = null;

        this[$wsCloseHandler] = function (code, message) {
            this.emit('close', false);
        }.bind(this);
        socket.once('close', this[$wsCloseHandler]);

        socket.on('error', this.emit.bind(this, 'error'));

        socket.on('message', function (data) {
            try {
                var msg = JSON.parse(data);

                var fn = handlers[msg.cmd];
                if (typeof(fn) === 'function') {
                    try {
                        fn.call(this, msg);
                    } catch (ex) {
                        this.replyError(msg, errCodes.ERR_UNKNOWN_ERROR, ex.message);
                    }
                } else {
                    this.replyError(msg, errCodes.ERR_UNKNOWN_COMMAND, "Unknown command %s", msg.cmd);
                }
            } catch (ex) {
                socket.close();
                return;
            }
        }.bind(this));
    }

    close() {
        this.emit('close', true);
        this.removeAllListeners();

        var socket = this[$ws];
        socket.removeListener('close', this[$wsCloseHandler]);
        socket.close();
    }

    send(type, data) {
        var ws = this[$ws];
        if (typeof type === "string") {
            switch (typeof data) {
                case 'undefined':
                    ws.send(type);
                    break;
                case 'object':
                    assert(data.type === undefined || data.type == type);
                    data.type = type;
                    ws.send(JSON.stringify(data));
                    break;
                default:
                    ws.send(JSON.stringify({
                        type: type,
                        data: data
                    }));
                    break;
            }
        } else {
            return ws.send(JSON.stringify(type));
        }
    }

    replyError(originMsg, code) {
        var msg = util.format.apply(util, Array.prototype.slice.call(arguments, 2));

        this.send({
            dialogId: originMsg && originMsg.dialogId || undefined,
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
