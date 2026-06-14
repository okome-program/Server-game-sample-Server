import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

const room = [];

wss.on("connection", (ws) => {
  if (room.length >= 2) {
    ws.send("サーバーが満員です");
    ws.close();
    return;
  }

  room.push(ws);
  ws.send("サーバーに参加しました");

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