const TournamentML = require("../models/tournament");
const PlayerCtrl = require('../controllers/playerController');
const FoodCtrl = require('../controllers/foodController');
const config = require("../config/config")

let rooms = [];
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
        playerData.x,
        playerData.y,
        playerData.numSnakeSections,
        playerData.playerId,
        playerData.roomId
    );
    
    // console.log("New player Joined:", newPlayer);
    
    const room = rooms[playerData.roomId];
 
    // console.log("player joined",rooms[playerData.roomId] )
    if (room) {

        if (!room.players) {
            room.players = []; 
        }
        
        // add new player to room
        socket.join(playerData.roomId);

        //check if player is exist in the room
        const isExistPlayer = rooms[playerData.roomId].players.find((player) => {
            return player.id == newPlayer.id
        });

        if(!isExistPlayer){
            // add new player to private room
            for (let index = 0; index < rooms[playerData.roomId].players.length; index++) {
    
                const player = rooms[playerData.roomId].players[index];
                console.log("exit player", {
                    playerId: player.id,
                    roomId: player.roomId,
                    spriteKey: "circle",
                    x: player.getX(),
                    y: player.getY(),
                })
    
                // Send existing players to the new player
                if (playerData.playerId !== player.id) {
                    socket.emit('new player', {
                        playerId: player.id,
                        roomId: player.roomId,
                        spriteKey: "circle",
                        x: player.getX(),
                        y: player.getY(),
                    }); 
                }
                
            }
            rooms[playerData.roomId].players.push(newPlayer);
            // Broadcast new player to connected socket clients
            console.log("new player", {
                x: playerData.x,
                y: playerData.y,
                numSnakeSections: playerData.numSnakeSections,
                playerId: playerData.playerId,
                roomId: playerData.roomId
            })
            io.to(playerData.roomId).emit('player joined', {
                x: playerData.x,
                y: playerData.y,
                numSnakeSections: playerData.numSnakeSections,
                playerId: playerData.playerId,
                roomId: playerData.roomId
            });
        }




        // send created FoodGroup X, Y
        // this.emit('food group', foodGroup)

    } else {
        socket.emit('errorMessage', 'Room not found');
    }
}

exports.movePlayer = (socket, res) =>{

}

exports.deletePlayer = (playerData) =>{
    rooms[playerData.roomId].players = rooms[playerData.roomId].players.filter(player => player.id !== playerData.playerId);
}

exports.rotatePlayer = function(socket, res) {
    // console.log("hahahaha");
    io.to(res.roomId).emit("otherplayer", {
        snakeLength: res.snakeLength,
        speed: res.speed,
        isLightingUp: res.isLightingUp,
        mousePosX: res.mousePosX,
        mousePosY: res.mousePosY,
        playerId: res.playerId,
        roomId: res.roomId,
        headX: res.x,
        headY: res.y,
        headPath: res.headPath
    });
}