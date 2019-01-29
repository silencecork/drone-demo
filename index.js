var express = require('express');
var ip = require("ip");
var app = express();

app.get('/', function (req, res) {
  var myip = ip.address()
  res.send('Hello World! ' + myip);
});

var server = app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

module.exports = server