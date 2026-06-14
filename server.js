import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

const room = [];
let nextid = 1;

wss.on("connection", (ws) => {

  ws.id = nextid++;
  room.push(ws);
  ws.send(JSON.stringify({
    type: "welcome",
    id: ws.id
  }));

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type === "next_room") {
      ws.send(JSON.stringify({
        type: "next_room",
        id: data.id
      }));
    }
  });

  ws.on("close", () => {
    const i = room.indexOf(ws);
    if (i !== -1) room.splice(i, 1);
  });
});