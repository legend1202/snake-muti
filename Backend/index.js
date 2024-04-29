// snamba server side

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const clientsocket = require('./src/sockets/clientsocket');
const userRouter = express.Router();
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

const PORT = process.env.PORT || 8000;

io.on('connection', async (socket) => {
    console.log('Socket connected !');
    await clientsocket.initsocket(socket, io);
});


app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'delux')));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
  
clientsocket.initdatabase();

server.listen(PORT,  () => {
    console.log("- Server Started!!!");
});
