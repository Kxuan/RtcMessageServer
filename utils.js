exports.isInteger = function isInteger(n) {
    return n === +n && n === (n | 0);
};