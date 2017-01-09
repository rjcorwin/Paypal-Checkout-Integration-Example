var http = require('http');
var express = require('express');
var path = require('path')
var ipn = require('paypal-ipn');
var app = express();
app.use('/', express.static(path.join(__dirname, './app/')));
app.post('/api/ipn', function(req, res) { 
  // Log IPN message to the terminal.
  console.log(req.body)
  // required response.
  res.send(200);
  // required call back to Paypal otherwise they keep repeating.
	ipn.verify(req.body, {'allow_sandbox': true}, function callback(err, msg) {
		if (err) {
			console.error(err);
		} 
	}); 
})
http.createServer(app).listen(80);
