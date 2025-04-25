const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res) => {
  res.send("Server is running");
});

let documentContent = ""; // Store the document content

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send the latest document content to the new user
  socket.emit("receive-change", documentContent);

  // Listen for content changes from the client
  socket.on("content-change", (newContent) => {
    documentContent = newContent; // Update the document content
    socket.broadcast.emit("receive-change", newContent); // Broadcast the update to other users
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
