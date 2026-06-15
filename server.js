import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

const room = [];
let nextid = 1;

let room_list_number = 1;
let room_list = [];

for (let i = 0; i < 10; i++) {
  room_list[i] = [];
  for (let j = 0; j < 2; j++) {
    room_list[i][j] = null;
  }
}

function sendToId(id, data) {
  const target = room.find(p => p.id === id);
  if (target) {
    target.send(JSON.stringify(data));
  }
}

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
          id: room_list[room_list_number][0],
          room_id: room_list_number
        }));
        if (room_list_number < 9) {
          room_list_number++;
        }else {
          room_list_number = 1;
        }
        break;

      case "conect_room":
        if (room_list[data.conect_room_number][0] === null) {
          sendToId(data.id, {
            type: "conect_error_room_null"
          });
        } else if(room_list[data.conect_room_number][1] === null) {
          room_list[data.conect_room_number][1] = data.id;
          sendToId(room_list[data.conect_room_number][0], {
            type: "match_conect"
          });
          sendToId(room_list[data.conect_room_number][1], {
            type: "conect_ok"
          });
        }else {
          sendToId(data.id, {
            type: "conect_error"
          });
        }
        break;
      case "game_start":
        if (room_list[data.room_number][0] === data.id) {
          sendToId(data.id, {
            type: "test"
          });
        }
        break;
    }
  });

  ws.on("close", () => {
    const i = room.indexOf(ws);
    if (i !== -1) room.splice(i, 1);
  });
});