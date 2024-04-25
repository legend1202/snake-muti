import io from 'socket.io-client';
const socket = io.connect('http://test.snamba.com');


export const initSocket = (roomId, playerName) => {

        socket.on('connect', () => {
            console.log("connected!");
            socket.emit('joinRoom', roomId, playerName);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    
        socket.on('playerJoined', (res) => {
            
            console.log(`${res.playerName} joined the room`);
        }); 
    
        socket.on('playerLeft', (playerName) => {
            console.log(`${playerName} left the room`);
        });
    
        socket.on('gameStateUpdate', (gameState) => {
            // Update game state and render changes on the canvas
            // updateGameState(gameState);
            // render();
        });

}