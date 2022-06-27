'use strict';

module.exports = {
    getRandomInt: (max) => Math.floor(Math.random() * max),
    getCapitalizedWord: (word) => word.charAt(0).toUpperCase() + word.slice(1),
};
