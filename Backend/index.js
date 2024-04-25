// snamba server side

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const clientsocket = require('./src/sockets/clientsocket');
const app = express();
const bodyParser = require('body-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:3000","http://test.snamba.com"];


app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log("origin---", origin);
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(cors({ origin: true }));

const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

io.on("connection", async(socket) => {
  
  await clientsocket.initsocket(socket, io);
  console.log("Socket Connected");
  
  socket.on("subscribe", (roomId) => {
    console.log(`Subscribing to room ${roomId}`);
    socket.join(roomId);
  });
  
  socket.on("error", (error) => {
    console.log("connet error", error);
  });
});

clientsocket.initdatabase();

server.listen(8000,  (io) => {
    console.log("- Server Started!!!");
});