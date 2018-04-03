'use strict';

var http = require('http'),
	path = require('path'),
	fs = require('fs');

var mimeTypes = {
	'.js' : 'text/javascript',
	'.html' : 'text/html',
	'.css' : 'text/css'
};

//------------------------------------------------------------------
function handleRequest(request, response) {
	var lookup = (request.url === '/') ? '/index.html' : decodeURI(request.url),
		file = lookup.substring(1, lookup.length);

	console.log('request: ' + request.url);
	fs.exists(file, function(exists) {
		if (exists) {
			console.log('Trying to send: ' + lookup);
			fs.readFile(file, function(err, data) {

				if (err) {
					response.writeHead(500);
					response.end('Server Error!');
				} else {
					response.end(data);
				}
			});
			console.log("sent.");
		} else {
			console.log('Failed to find/send: ' + lookup);
			response.writeHead(404);
			response.end();
		}
	});
}

http.createServer(handleRequest).listen(3000, function() {
	console.log('Server is listening on port 3000');
});