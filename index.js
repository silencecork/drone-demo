var express = require('express');
var ip = require("ip");
var app = express();

app.get('/', function (req, res) {
  var myip = ip.address()
  res.status(200).send('Hello World! v4 ' + myip);
});

var server = app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

module.exports = server