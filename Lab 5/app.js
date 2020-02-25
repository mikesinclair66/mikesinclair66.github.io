var http = require('http');
var fs = require('fs');

http.createServer((req, res) => {
	fs.readFile('artistDir.css', (err, data) => {
		res.writeHead(200, {'Content-Type:': 'text/css'});
		res.write(data);
		res.end();
	});

	fs.readFile('index.html', (err, data) => {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(data);
	});
}).listen(3000);