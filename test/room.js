var assert = require('assert');
var Room = require('../room/room');

describe("Room", function () {
    var roomId = 123, room;

    describe("create room", function () {
        room = new Room(roomId);

        it("should not closed", function () {
            assert(!room.isClosed)
        });
        it("id should be 123", function () {
            assert(room.id == 123);
        });
        it("should not have clients", function () {
            assert(room.count == 0);
            assert(Object.keys(room.clients).length == 0);
            assert(room.isEmpty());
        });
        it("should not be fulled", function () {
            assert(!room.isFull());
        });
    });

    describe("close room", function () {
        it("should emit close", function () {
            var hasEmitClose = false;
            room.once('close', function () {
                hasEmitClose = true;
            });
            room.close();
            assert(hasEmitClose && room.isClosed);
        });
    });
});