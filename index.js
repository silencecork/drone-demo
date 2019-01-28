var express = require('express');
var ip = require("ip");
var app = express();

app.get('/', function (req, res) {
  var myip = ip.address()
  res.send('Hello World!' + myip);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});