const http = require("http");
const { decode } = require("punycode");
const url = require("url");
const StringDecoder = require('string_decoder').StringDecoder;

var server = http.createServer(function (req, res) {
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
    var buffer = '';
    req.on('data',function(data){
      buffer += decoder.write(data);   //as some piece of payloads comes we catch it with event listener and decode it and save it to buffer
    })
    req.on('end', function(){   //ends of a request coming
      buffer += decoder.end();

      res.end("hello\n");

      console.log("Path : ", trimmedPath);
      console.log("method : ", method);
      console.log("query : ", queryObject);
      console.log("payloads : ", buffer);
      console.log('----------------------','\n');

    })




    

});


server.listen(5500, function () {
  console.log("listening on port 5500");
});
