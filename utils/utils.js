const request = require("request");
const q = require("q");

module.exports = function(){
    var utils = {
        request: request,
        q: q
    }
    return utils;
}