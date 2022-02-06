import * as http from "http";
import * as socketio from "socket.io";
import { ChatController } from "./controllers/chat";

const createServer = (expressApp: http.RequestListener) => {
  const server: http.Server = http.createServer(expressApp);
  const io: socketio.Server = new socketio.Server();
  io.attach(server);

  io.on("connection", (socket: socketio.Socket) => {
    new ChatController(socket);
  });

  return server;
};

export default createServer;
