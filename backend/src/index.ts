import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const roomMap = new Map<WebSocket, string>();

wss.on("connection", (socket) => {

  socket.on("message", (data) => {
    let msg;
    try {
      msg = JSON.parse(data.toString());
    } catch {
      return;
    }

    if (msg.type === "join") {
      roomMap.set(socket, msg.payload.roomId);

      for (const [client, clientRoom] of roomMap) {
        if (clientRoom === msg.payload.roomId) {
          client.send(JSON.stringify({
            type: "system",
            message: `${msg.payload.username} joined`
          }));
        }
      }
    }

    if (msg.type === "chat") {
      const room = roomMap.get(socket);

      if (!room) return;

      for (const [client, clientRoom] of roomMap) {
        if (clientRoom === room) {
          client.send(JSON.stringify({
            sender: msg.payload.username,
            message: msg.payload.message
          }));
        }
      }
    }
  });

  socket.on("close", () => {
    roomMap.delete(socket);
  });
});
