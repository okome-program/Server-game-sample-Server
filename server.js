import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

const room = [];
let nextid = 1;

let room_list_number = 1;
let room_list = [];

wss.on("connection", (ws) => {

  ws.id = nextid++;
  room.push(ws);
  ws.send(JSON.stringify({
    type: "welcome",
    id: ws.id
  }));

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    switch (data.type) {
      case "create_room":
        room_list[room_list_number] = [data.id, null];
        ws.send(JSON.stringify({
          type: "next_room",
          id: room_list[0, 0]
        }));
        break;
    }
  });

  ws.on("close", () => {
    const i = room.indexOf(ws);
    if (i !== -1) room.splice(i, 1);
  });
});