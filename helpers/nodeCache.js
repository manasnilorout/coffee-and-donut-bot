'use strict';

const NodeCache = require('node-cache');
let myCache;

if (!myCache) {
    myCache = new NodeCache({ stdTTL: 15 * 50, checkperiod: 120 });
}

module.exports = myCache;