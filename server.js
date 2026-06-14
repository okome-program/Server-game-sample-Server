import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

const room = [];
let nextid = 1;

wss.on("connection", (ws) => {

  ws.id = nextid++;
  room.push(ws);
  ws.send("あなたのID: ", ws.id);

  ws.on("message", (msg) => {
    room.forEach(client => {
      if (client !== ws && client.readyState === 1) {
        client.send(msg);
      }
    });
  });

  ws.on("close", () => {
    const i = room.indexOf(ws);
    if (i !== -1) room.splice(i, 1);
  });
});