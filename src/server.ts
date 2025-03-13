import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { createServer } from "http";
import { Server } from "socket.io";
import handleSocketConnection from "./app/socket";

let io: Server;

async function main() {
  await mongoose.connect(config.database_url as string);
  const server = createServer(app);

  // Initialize Socket.IO
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://simple-chat-app-socketio.vercel.app",
      ],
      credentials: true,
    },
  });
  await handleSocketConnection(io);

  server.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
}

// Export io to use in other files
export { io };

main();
