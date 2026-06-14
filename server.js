import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", (ws) => {
    ws.send("接続成功！");

    ws.on("message", (msg) => {
        ws.send("受け取った！: " + msg);
    });
});