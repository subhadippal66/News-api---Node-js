const http = require("http");
const https = require('https');
const url = require("url");
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');

const config =  require('./config');

// http server
var httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});
httpServer.listen(config.httpPort, function () {
  console.log(`listening on port ${config.httpPort} and ${config.envName} mode`);
});

// https server
var httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(req, res);
});
httpsServer.listen(config.httpsPort, function () {
  console.log(`listening on port ${config.httpsPort} and ${config.envName} mode`);
});

// All server logic {http & https}
var unifiedServer = function(req, res){
  var parserUrl = url.parse(req.url, true);

  // get the path
  var path = parserUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, ""); // trimmed any unwanted string

  // get the req method
  var method = req.method;

  // get the query string object
  var queryObject = parserUrl.query;

  // get the headers 
  var headers = req.headers;
  
  // get the payload
  var decoder = new StringDecoder('utf-8');
  // payloads comes to node as steam wee need to catch it
  var buffer = ''; //body 
  req.on('data',function(data){
    buffer += decoder.write(data);   //as some piece of payloads comes we catch it with event listener and decode it and save it to buffer
  })



  req.on('end', function(){   //ends of a request coming
    buffer += decoder.end();

    // choose the handler this request should go to
    var choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // construct the data object send to the handler
    var data = {
      trimmedPath,
      queryObject,
      method,
      headers,
      'payload' : buffer
    }

    // route the request to the specified handler
    choosenHandler(data, function(statusCode, payload){
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      payload = typeof(payload) == 'object' ? payload : {};

      var payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString)
    })


    console.log("Path : ", trimmedPath);
    console.log("method : ", method);
    // console.log("query : ", queryObject);
    // console.log("payloads : ", buffer);
    console.log('----------------------','\n');

  })
}

// defining the handlers
var handlers = {}

handlers.notFound = function(data, callback){
  let resPayload = {'message':'not found'};
  callback(404, resPayload);
}

// defining and requiring a router
let ping = require('./Routes/ping') 
let toi_briefs = require('./Routes/toi_briefs') 
let wion_india = require('./Routes/wion_india') 
var router = {
  'ping' : ping,
  'toi_briefs' : toi_briefs,
  'wion_india' : wion_india,
}