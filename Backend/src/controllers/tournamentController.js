const TournamentML = require("../models/tournament");
const PlayerCtrl = require('../controllers/playerController');

const rooms = [];
var io = null;

exports.getTournaments = function () {
    TournamentML.getTournaments((res) => {
        res.forEach(room => {
            rooms[room._id] = room;
        });
    });
}

exports.setSocket = function (socketIO) {
    io = socketIO
}

exports.joinRoom = function (socket, playerData) {
        
    const newPlayer = new PlayerCtrl.Player(
        playerData.headX,
        playerData.headY,
        playerData.playerId,
        playerData.roomId
    );
    
    const room = rooms[playerData.roomId];
 
    if (room) {

        if (!!!room.players) {
            room.players = [];
            rooms[playerData.roomId].foods = new Array(100).fill().map((_, index) => {
                return {
                    x: Math.random(),
                    y: Math.random(),
                    index: index
                }
            });
        }
        
        // add new player to room
        
        //check if player is exist in the room
        const isExistPlayer = rooms[playerData.roomId].players.find((player) => {
            return player.id == playerData.playerId
        });
        
        if(!isExistPlayer){
            socket.join(playerData.roomId);
            // add new player to private room
            // Broadcast new player to connected socket clients
            io.to(playerData.roomId).emit('player joined', {
                headX: playerData.headX,
                headY: playerData.headY,
                playerId: playerData.playerId,
                roomId: playerData.roomId
            });

            rooms[playerData.roomId].players.push(newPlayer);

            for (let index = 0; index < rooms[playerData.roomId].players.length; index++) {
    
                const player = rooms[playerData.roomId].players[index];
                if ((player.id != playerData.playerId) && (player.id != undefined)) {
                    
                    socket.emit('new player', {
                        playerId: player.id,
                        roomId: player.roomId,
                        headX: player.getX(),
                        headY: player.getY(),
                    }); 
                }
            }
        }

        socket.emit('init food', {
            foods: room.foods,
        }); 

    } else {
        socket.emit('errorMessage', 'Room not found');
    }
}

exports.movePlayer = (socket, res) =>{

}

exports.deletePlayer = (playerData) =>{
    rooms[playerData.roomId].players = rooms[playerData.roomId].players.filter(player => player.id != playerData.playerId);
    io.to(playerData.roomId).emit("delete player", {
        playerId: playerData.playerId,
        roomId: playerData.roomId
    });
}
exports.deleteFood = (data) =>{
    rooms[data.roomId].foods = rooms[data.roomId].foods.filter(food => food.index != data.foodId);
    io.to(data.roomId).emit("delete food", {
        foodId: data.foodId,
    });
}

exports.generateFood = (data) =>{
    // console.log("generate food", data);
}

exports.rotatePlayer = function(socket, res) {
    
    const currentPlayer = rooms[res.roomId].players.find((player) => {
        return player.id == res.playerId
    });
    // console.log(currentPlayer);
    if(!!!currentPlayer){
    }else{
        // Update player position
        currentPlayer.setX(res.headX);
        currentPlayer.setY(res.headY);

    }

    io.to(res.roomId).emit("rotate player", {
        snakeLength: res.snakeLength,
        mousePosX: res.mousePosX,
        mousePosY: res.mousePosY,
        playerId: res.playerId,
        roomId: res.roomId,
        headX: res.headX,
        headY: res.headY,
        headPath: res.headPath
    });
}