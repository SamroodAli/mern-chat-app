import * as http from "http";
import * as socketio from "socket.io";

const createServer = (expressApp: http.RequestListener) => {
  const server: http.Server = http.createServer(expressApp);
  const io: socketio.Server = new socketio.Server();
  io.attach(server);

  io.on("connection", (socket: socketio.Socket) => {
    console.log("connection");
    socket.on("message", (message: string) => {
      socket.emit("message", message);
    });

    socket.on("disconnect", () => {
      console.log("client disconnected");
    });
  });

  return server;
};

export default createServer;
