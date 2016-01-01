"use strict";
var utils = require('../utils'),
    EventEmitter = require('events').EventEmitter,
    Debug = require('debug');

var $debug = Symbol("Room's debugger"),
    $id = Symbol("Room Id"),
    $count = Symbol("The count of clients in this room"),
    $clients = Symbol("all clients in this room"),
    $clientQuitHandler = Symbol("quit the client from this room when client close"),
    $longEmptyCloseTimer = Symbol("close the room if the room is empty for a long time.");

class Room extends EventEmitter {

    /**
     * @param {int} id
     */
    constructor(id) {
        super();
        if (!utils.isInteger(id))
            throw new TypeError("id must be a integer");

        /** @type {int} 为空时表示房间关闭 */
        this[$id] = id;
        /** @type {int} 房间中客户端数量 */
        this[$count] = 0;
        /** @type {Object.<int,RTCClient>} 房间中的所有客户端 */
        this[$clients] = {__proto__: null};
        /** @type {function} 自己的调试器 */
        this[$debug] = Debug("room:" + id);

        this[$debug]("create");

        this.broadcasts = [];

        var self = this;
        process.nextTick(function () {
            if (self.isEmpty()) {
                self[$longEmptyCloseTimer] = setTimeout(self.close.bind(self), 60 * 1000);
            }
        });
    }

    get isClosed() {
        return this[$id] === undefined;
    }

    get id() {
        return this[$id];
    }

    get count() {
        return this[$count];
    }

    get clients() {
        return this[$clients];
    }

    isEmpty() {
        return this[$count] == 0;
    }

    isFull() {
        return false;
    }

    /**
     * 踢出所有客户端、关闭房间
     */
    close() {
        if (this[$longEmptyCloseTimer])
            clearTimeout(this[$longEmptyCloseTimer]);

        var allClients = this[$clients];
        for (var id in allClients) {
            this.quit(allClients[id]);
        }

        this.emit('close');
        this.removeAllListeners();
        //丢弃自己的房间ID
        delete this[$id];

        this[$debug]("closed");
    }

    /**
     * 客户端进入该房间
     *
     * 房间关闭后不允许客户端进入房间
     *
     * @param {RTCClient} client
     */
    join(client) {
        if (this.isClosed) {
            throw new Error("room is closed");
        }

        //关闭“长时间没人加入关闭房间”的定时器
        if (this[$longEmptyCloseTimer]) {
            clearTimeout(this[$longEmptyCloseTimer]);
            delete this[$longEmptyCloseTimer];
        }
        if (client.id === null) {
            throw new Error("client id is null");
        }
        if (client.room !== null) {
            throw new Error("client in room");
        }

        if (this.isFull()) {
            throw new Error("room is full");
        }

        var allClients = this[$clients];
        if (client.id in allClients) {
            throw new Error("client already in room");
        }

        //广播 join 消息
        for (var id in allClients) {
            allClients[id].send("join", {id: client.id});
        }

        //客户端关闭时，退出房间
        client[$clientQuitHandler] = this.quit.bind(this, client);
        client.once('close', client[$clientQuitHandler]);

        //加入房间
        ++this[$count];
        allClients[client.id] = client;
        client.room = this;
        this[$debug]("client-%d join", client.id);
        this.emit("join", client);
    }

    /**
     * 客户端离开该房间
     * @param {RTCClient} client
     */
    quit(client) {
        if (client.room !== this) {
            throw new Error("Client is not in this room.");
        }
        //不再监听客户端关闭事件
        client.removeListener('close', client[$clientQuitHandler]);
        delete client[$clientQuitHandler];

        //离开房间
        --this[$count];
        delete this[$clients][client.id];
        client.room = null;
        this[$debug]("client-%d quit", client.id);
        this.emit('quit', client);

        //广播leave消息
        var allClients = this[$clients];
        for (var id in allClients) {
            allClients[id].send("leave", {id: client.id});
        }

        //10秒后再没有人进入房间，则关闭房间
        if (this.isEmpty()) {
            this[$longEmptyCloseTimer] = setTimeout(this.close.bind(this), 10 * 1000);
        }
    }

    /**
     * 获取当前房间信息
     *
     * 房间关闭时返回null
     * @returns {*}
     */
    info() {
        if (this.isClosed)
            return null;
        return {
            id: this.id,
            clients: Object.keys(this.clients)
        }
    }

    /**
     * 通过客户端ID获取当前房间的某一客户端
     * @param clientId
     * @returns {RTCClient}
     */
    client(clientId) {
        var allClients = this[$clients];
        return allClients[clientId];
    }
}

module.exports = exports = Room;