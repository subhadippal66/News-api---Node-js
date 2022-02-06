var ping = function(data, callback){
    let resPayload = {'message':'Up and Running'};
    callback(200, resPayload);
}

module.exports = ping;