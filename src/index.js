import { server as WebSocketServer } from "websocket";
import http from 'node:http'
import { DB } from "./store.js";

const server = http.createServer((req, res) => {
    console.log((new Date()) , "Recieved request for", req.url);
    // res.write(DB);
    res.end(JSON.stringify(DB));
})

server.listen(3000, () => {
    console.log('Server started on port 3000');
})

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
})

const originIsAllowed = (origin) => {
    return true;
}

wsServer.on('request', (req) => {
    if(!originIsAllowed(req)){
        req.reject();
        console.log((new Date()) + ' Connection from origin ' + req.origin + ' rejected.');
        return;
    }

    const connection = req.accept();
    console.log("Connection has established!");

    connection.on('message', (message) => {
        const data = JSON.parse(message.utf8Data);

        functionHandler(connection, data);
    })

    connection.on('close', (reasonCode, desc) => {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    })
})

const functionHandler = (connection, message) => {
    console.log({ message })
    if(message.type === 'SEND_MESSAGE') {
        connection.sendUTF(JSON.stringify(message))
    } 
}