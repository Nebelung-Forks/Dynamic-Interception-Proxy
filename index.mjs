import { Server } from './server/Server.mjs';
import { readFileSync } from 'fs';
import http from 'http';
import nodeStatic from 'node-static';

const bare = new Server('/service/', '');
const serve = new nodeStatic.Server('./');

const server = http.createServer();

server.on('request', (request, response) => {
    request.url = request.url.replace('https://','https:/').replace('https:/','https://')
    console.log(request.url)
    if (bare.route_request(request, response)) return true;
    serve.serve(request, response);
});

server.on('upgrade', (req, socket, head) => {
	if(bare.route_upgrade(req, socket, head))return;
	socket.end();
});

server.listen(process.env.PORT || 8080);