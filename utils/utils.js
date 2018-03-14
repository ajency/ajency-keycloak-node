const request = require("request");
const q = require("Q");

module.exports = function(){
    var utils = {
        request: request,
        q: q
    }
    return utils;
}