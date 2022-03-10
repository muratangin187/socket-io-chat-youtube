const express = require('express');
const app = express();
const cors = require('cors')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["POST", "GET"]
    }
});
app.use(cors({
    origin: "http://localhost:3001"
}))


const users = {};


const messages = [];


app.get('/', (req, res) => {
    res.send("Hello");
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("join", (username) => {
        users[socket.id] = username;
        console.log("USER:" + username + " and id: " + socket.id);
        io.to(socket.id).emit("message", "Hiii");
        io.to(socket.id).emit("loadMessages", messages);
    });

    socket.on("message", (message) => {
        const newMessage = {
            from: users[socket.id],
            content: message
        };
        messages.push(newMessage);
        io.emit("newMessage", newMessage);
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
