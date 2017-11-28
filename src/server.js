const express = require("express");
const app = express();
const socket = require("socket.io");
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
const io = socket(server);
io.on("connection", (socket) => {
    socket.on("chat", (data) => {
        io.sockets.emit("chat", data);
    });
    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
    });
    socket.on("stopped", (data) => {
        if (!data.typing) {
            socket.broadcast.emit("stopped", data);
        }
    });
});

app.use("/static", express.static(__dirname + "/static"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/index.html");
});

