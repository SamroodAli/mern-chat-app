import * as http from "http";
import * as socketio from "socket.io";
import { ChatController } from "./controllers/sockets/chat";
import { ForwardController } from "./controllers/sockets/forward";

const createServer = (expressApp: http.RequestListener) => {
  const server: http.Server = http.createServer(expressApp);
  const io: socketio.Server = new socketio.Server();
  io.attach(server);

  io.on("connection", (socket: socketio.Socket) => {
    socket.on("login", (sender, reciever) => {
      new ChatController(socket, io, sender, reciever);
      new ForwardController(socket, sender);
    });
  });

  return server;
};

export default createServer;
