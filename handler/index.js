var fs = require('fs'),
    path = require('path'),
    debug = require('debug')('handler');

/** @type {string[]} */
var files = fs.readdirSync(__dirname);
var selfName = path.basename(__filename);
files.filter(function (file) {
    return file != selfName && path.extname(file) == ".js"
}).forEach(function (file) {
    var basename = path.basename(file, '.js'),
        fullpath = path.join(__dirname, file);
    var fn = require(fullpath);
    if (typeof(fn) != 'function') {
        throw new TypeError("Illegal Handler " + file);
    }
    debug("register %s for %s", fn.name, basename);
    exports[basename] = fn;
});