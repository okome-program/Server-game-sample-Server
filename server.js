import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

const room = [];
let nextid = 1;

let id_a = null;
let id_b = null;
let room_bool = false;

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
      case "next_room":
        if (id_a == null) {
          id_a = data.id;

        }else if (id_a != null) {
          if (id_b == null) {
            id_b = data.id;
            room_bool = true;

          }else {
            id_a = null;
            id_b = null;
            room_bool = false;
        
          }
        }
        ws.send(JSON.stringify({
          type: "next-room",
          id: "Python"
        }));
    }
  });

  ws.on("close", () => {
    const i = room.indexOf(ws);
    if (i !== -1) room.splice(i, 1);
  });
});