var assert = require('assert');

var http = require('http'),
    WebSocket = require('ws'),
    WebSocketServer = WebSocket.Server,
    RTCClient = require('../RTCClient');

describe("RTCClient", function () {
    var server = http.createServer();
    var wss = new WebSocketServer({
        server: server
    });

    server.listen(0);
    var addr = server.address();
    var socket = new WebSocket("ws://127.0.0.1:" + addr.port);
    var c;

    var received = "";
    Object.defineProperty(socket, "send", {
        get: function () {
            return function testSend(data) {
                received += data;
            };
        }
    });

    describe("create", function () {
        c = new RTCClient(socket);

        it("id should be null", function () {
            assert(c.id === null);
        });

        it("room should be null", function () {
            assert(c.room === null)
        });
    });

    describe("send", function () {
        it("should send raw string", function () {
            var TEST_DATA = Math.random().toString();
            received = "";
            c.send(TEST_DATA);
            assert.equal(received, TEST_DATA);
        });
        it("should wrap type & data", function () {
            var TEST_DATA = {key: 123, data: [Math.random()]};
            received = "";
            c.send('test', TEST_DATA);

            var r = JSON.parse(received);
            assert.equal(r.type, "test");
            assert.equal(r.key, TEST_DATA.key);
            assert.deepStrictEqual(r.data, TEST_DATA.data);
        });
        it("should encode data using JSON", function () {
            var TEST_DATA = {key: 123, data: [Math.random()]};
            received = "";
            c.send(TEST_DATA);

            JSON.parse(received);
            assert.equal(received, JSON.stringify(TEST_DATA));
        });
    });
    describe("reply", function () {

        it("test without dialog", function () {
            received = "";
            c.reply(null, 'test', 'data');

            var r = JSON.parse(received);
            assert.strictEqual(r.dialogId, undefined);
            assert.equal(r.type, "test");
            assert.equal(r.data, "data");
        });
        it("test with dialog", function () {
            received = "";
            c.reply({dialogId: 123}, 'test', 'data');

            var r = JSON.parse(received);
            assert.equal(r.dialogId, 123);
            assert.equal(r.type, "test");
            assert.equal(r.data, "data");
        });
    });


    describe("replyError", function () {

        it("test without dialog", function () {
            received = "";
            c.replyError(null, 123, '%s', "test");

            var r = JSON.parse(received);
            assert.strictEqual(r.dialogId, undefined);
            assert.equal(r.type, "error");
            assert.equal(r.code, 123);
            assert.equal(r.message, "test");
        });
        it("test with dialog", function () {
            received = "";
            c.replyError({dialogId: 1234}, 123, '%s', "test");

            var r = JSON.parse(received);
            assert.equal(r.dialogId, 1234);
            assert.equal(r.type, "error");
            assert.equal(r.code, 123);
            assert.equal(r.message, "test");
        });
    });

    describe("close", function () {
        it("should post close event when socket close", function (done) {
            socket.close();
            c.once('close', function (couldSendData) {
                assert.strictEqual(couldSendData, false);
                done();
            });
        });
    });
});