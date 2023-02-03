import http from "http";
import { Server } from "socket.io";

import app from "../routes/middlewares";

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.WEB_URL,
    methods: ["GET", "POST"],
  },
});

httpServer.listen(+(process.env.PORT || "") || 3001);

export default io;
