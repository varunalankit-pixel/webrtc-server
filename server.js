const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;

// Create normal HTTP server first
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("WebRTC Signaling Server Running");
});

// Attach WebSocket to HTTP server
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", ws => {
  console.log("Client connected");
  clients.push(ws);

  ws.on("message", msg => {
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  ws.on("close", () => {
    clients = clients.filter(c => c !== ws);
    console.log("Client disconnected");
  });
});

// Start server
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
