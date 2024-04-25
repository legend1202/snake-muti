var config = require('../../config/config.js');

exports.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.randomSpawnPoint = function () {
    return {
        x: exports.randomInt(5000 * 5, config['gameRadius'] * 5),
        y: exports.randomInt(5000 * 5, config['gameRadius'] * 5)
    };
};

exports.chunk = function (arr, chunkSize) {
    var R, i;
    R = [];
    i = 0;
    while (i < arr.length) {
        R.push(arr.slice(i, i + chunkSize));
        i += chunkSize;
    }
    return R;
};

exports.distanceFormula = function (x1, y1, x2, y2) {
    const withinRoot = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
    const dist = Math.pow(withinRoot, 0.5);
    return dist;
}
