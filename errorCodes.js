var messages = exports.messages = {__proto__: null};

exports.ERR_OK = 0x0;
messages[exports.ERR_OK] = "OK";

exports.ERR_UNKNOWN_ERROR = 0x001;
messages[exports.ERR_UNKNOWN_ERROR] = "Unknown Error";
exports.ERR_UNKNOWN_COMMAND = 0x002;
messages[exports.ERR_UNKNOWN_COMMAND] = "Unknown Command";

exports.ERR_ILLEGAL = 0x100;
messages[exports.ERR_ILLEGAL] = "Illegal Request";
exports.ERR_ILLEGAL_ARGUMENTS = 0x101;
messages[exports.ERR_ILLEGAL_ARGUMENTS] = "Illegal Arguments";

exports.ERR_CLIENT = 0x200;
messages[exports.ERR_CLIENT] = "Client Error";
exports.ERR_CLIENT_INROOM = 0x201;
messages[exports.ERR_CLIENT_INROOM] = "Client already in room";
exports.ERR_CLIENT_NOT_INROOM = 0x202;
messages[exports.ERR_CLIENT_NOT_INROOM] = "Client is not in a room";
exports.ERR_CLIENT_NOT_EXISTS = 0x203;
messages[exports.ERR_CLIENT_NOT_EXISTS] = "Client not exists";

exports.ERR_ROOM = 0x300;
messages[exports.ERR_ROOM] = "Room Error";
exports.ERR_ROOM_FULL = 0x301;
messages[exports.ERR_ROOM_FULL] = "Room full";
