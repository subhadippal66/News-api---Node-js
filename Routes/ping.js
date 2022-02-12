const timestamp = require('../time')

var ping = function(data, callback){
    let resPayload = {'message':'Up and Running',timestamp};
    callback(200, resPayload);
}

module.exports = ping;