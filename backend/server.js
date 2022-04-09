require("dotenv").config();
const express = require("express");
const DbConnect = require("./database");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ACTIONS = require("./actions");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

DbConnect();

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use("/storage", express.static("storage"));

app.use("/api/auth", authRoutes);
app.use("/api", roomRoutes);

const socketUserMapping = {};

io.on("connection", (socket) => {
  console.log(socket.id, "connected");

  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMapping[socket.id] = user;
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });

      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMapping[clientId],
      });
    });
    socket.join(roomId);
  });

  // when relay ice
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate,
    });
  });

  // when relay sdp
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sdp }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sdp,
    });
  });

  /**
   * handling mute/unmute
   */

  socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.MUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  socket.on(ACTIONS.UNMUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.UNMUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  // leaving

  const leaveRoom = () => {
    const { rooms } = socket;

    Array.from(rooms).forEach((roomId) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      clients.forEach((clientId) => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMapping[socket.id]?.id,
        });

        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: clientId,
          userId: socketUserMapping[clientId]?.id,
        });
      });
      socket.leave(roomId);
    });
    delete socketUserMapping[socket.id];
  };

  socket.on(ACTIONS.LEAVE, leaveRoom);

  socket.on("disconnecting", leaveRoom);
});

const PORT = process.env.PORT || 5100;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
