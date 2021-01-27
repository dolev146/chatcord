const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "ChatCord Bot";

//run when client connects
io.on("connection", (socket) => {
  // when connecting
  socket.emit("message", formatMessage(botName, "Welcome to Dolevdo"));

  // Bordcast when a user connects
  socket.broadcast.emit("message", formatMessage(botName, "A user has joined the chat"));

  // Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });

  //Listen for chatmessage
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage('USER', msg));
  });
});

const PORT = process.env.PORT || 3000;

// set static folder
app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => console.log(`Server runing on port ${PORT}`));
