"use strict";
var EventEmitter = require('events').EventEmitter,
    Room = require('./room');

var $count = Symbol("The count of rooms"),
    $rooms = Symbol("all rooms");

class RoomManager extends EventEmitter {
    constructor() {
        super();
        this[$count] = 0;
        this[$rooms] = {__proto__: null};
    }

    get count() {
        return this[$count];
    }

    /**
     * 创建房间
     *
     * @param {int} roomId
     * @returns {Room}
     */
    create(roomId) {
        if (roomId in this[$rooms])
            throw new Error("Room ID exists");

        var allRooms = this[$rooms];
        var room = new Room(roomId);
        room.once('close', function () {
            delete allRooms[this.id];
            --this[$count];
        });

        allRooms[roomId] = room;
        ++this[$count];
        return room;
    }

    /**
     * 通过房间ID获取房间对象，
     * 房间不存在时创建房间
     *
     * @param {int} roomId
     * @param {boolean} dontCreate 是否禁止创建房间
     * @returns {Room}
     */
    room(roomId, dontCreate) {
        var allRooms = this[$rooms];

        if (roomId in allRooms) {
            return allRooms[roomId];
        }

        //房间未找到

        //禁止创建房间
        if (dontCreate) {
            return null;
        }

        //创建房间
        return this.create(roomId);

    }
}

module.exports = exports = RoomManager;