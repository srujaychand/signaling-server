const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

let clients = {};

wss.on("connection", (ws) => {
  const id = Math.random().toString(36).substring(2);
  clients[id] = ws;

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.to && clients[data.to]) {
      clients[data.to].send(JSON.stringify({
        from: id,
        ...data
      }));
    }
  });

  ws.on("close", () => {
    delete clients[id];
  });

  ws.send(JSON.stringify({ type: "id", id }));
});

console.log("WebSocket server running...");