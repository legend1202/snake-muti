import Phaser from "phaser-ce"
import Util from "./util"
import PlayerSnake from './playerSnake'
import OtherPlayerSnake from "./otherPlayerSnake"
import Food from "./food"

import Circle from "../../Assets/circle.png"
import Shadow from "../../Assets/white-shadow.png"
import Ewhite from "../../Assets/eye-white.png"
import Eblack from "../../Assets/eye-black.png"
import Hex from "../../Assets/hex.png"
import Background from "../../Assets/tile.png"
import io from 'socket.io-client'

export default class Game {

    constructor(game) {
        this.game = game;
        this.foodGroup = null;
        this.snakeHeadCollisionGroup = null;
        this.foodCollisionGroup = null;
        this.roomId = game.parent.roomId;
        this.playerId = game.parent.playerId;
        this.game.snakes = [];
        this.newSnake = null;

    }

    preload() {
        // Load assets
        this.game.load.image('circle', Circle);
        this.game.load.image('shadow', Shadow);
        this.game.load.image('background', Background);
        this.game.load.image('eye-white', Ewhite);
        this.game.load.image('eye-black', Eblack);
        this.game.load.image('food', Hex);
    }

    create() {

        // this.socket = io('http://localhost:8000');
        this.socket = io('http://189.1.172.139');
        var width = this.game.width;
        var height = this.game.height;
        this.game.world.setBounds(-width, -height, width * 2, height * 2);
        this.game.stage.backgroundColor = '#444';

        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.foodGroup = this.game.add.group();
        this.snakeHeadCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.foodCollisionGroup = this.game.physics.p2.createCollisionGroup();


        // Create New Player Object
        const snake = new PlayerSnake({
            game: this.game,
            spriteKey: 'circle',
            x: 0,
            y: 0,
            numSnakeSections: 30,
            playerId: this.playerId,
            roomId: this.roomId,
            socket: this.socket
        });

        this.newSnake = snake;
        this.game.camera.follow(snake.head);

        // Initialize snake groups and collision
        for (var i = 0; i < this.game.snakes.length; i++) {
            const childSnake = this.game.snakes[i];
            childSnake.head.body.setCollisionGroup(this.snakeHeadCollisionGroup);
            childSnake.head.body.collides([this.foodCollisionGroup]);
            childSnake.addDestroyedCallback(this.snakeDestroyed, this);
        }

        // Socket connection successful
        this.socket.on('connect', this._onSocketConnected.bind(this))

        // New player message received
        this.socket.on('food group', this._onFoodGroup.bind(this))

        // Socket disconnection
        this.socket.on('disconnect', this._onSocketDisconnect.bind(this))

        // New player message received
        this.socket.on('player joined', this._onNewPlayer.bind(this))

        //food init at the first
        this.socket.on('init food', this.loadFood.bind(this));

        this.socket.on('new player', this.handleNewPlayer.bind(this));

    }

    update() {

        // Update game components
        for (var i = this.game.snakes.length - 1; i >= 0; i--) {
            this.game.snakes[i].update();
        }

        for (var i = this.foodGroup.children.length - 1; i >= 0; i--) {
            var f = this.foodGroup.children[i];
            f.food.update();
        }
    }

    initFood(x, y,index, tint) {
        var f = new Food(this.game, x, y, index, this.socket, this.roomId, tint);
        f.sprite.body.setCollisionGroup(this.foodCollisionGroup);
        this.foodGroup.add(f.sprite);
        f.sprite.body.collides([this.snakeHeadCollisionGroup]);
        return f;
    }

    snakeDestroyed(snake) {
        for (var i = 0; i < snake.headPath.length; i += Math.round(snake.headPath.length / snake.snakeLength) * 2) {
            this.initFood(
                snake.headPath[i].x + Util.randomInt(-10, 10),
                snake.headPath[i].y + Util.randomInt(-10, 10)
            );
        }
        this._onSocketDisconnect.bind(this);
    }

    _onSocketConnected() {
        // Send local player data to the game server
        this.socket.emit('new player', { 
            headX: 0,
            headY: 0,
            numSnakeSections: 30,
            playerId: this.playerId,
            roomId: this.roomId,
         });
    }

    //Player start rotating with the data from server
    _onRotatePlayer(res) {
        
        this.game.snakes.forEach((element, i) => {
            if(element.snake){
                element.snake[i].rotatePlayer( res.headX, res.headY );
            }
        });
    }

    _onFoodGroup(foodGroup) {
        
    }

    _onSocketDisconnect() {
        this.socket.emit('delete player', {playerId:this.playerId, roomId: this.roomId});
        window.location.href = "http://test.snamba.com/";
        // window.location.href = "http://localhost:3000";
        
    }

    _onNewPlayer(data) {
        if (data.playerId != this.playerId) {
            new OtherPlayerSnake({
                game: this.game,
                spriteKey: 'circle',
                x: 0,
                y: 0,
                numSnakeSections: 30,
                playerId: data.playerId,
                roomId: data.roomId,
                socket: this.socket,
                foodGroup: this.foodGroup, 
                snakeHeadCollisionGroup: this.snakeHeadCollisionGroup, 
                foodCollisionGroup: this.foodCollisionGroup 
            });
        }
    }

    handleNewPlayer(data){
        if (data.playerId != this.playerId) {
            new OtherPlayerSnake({
                game: this.game,
                spriteKey: 'circle',
                x: data.headX,
                y: data.headY,
                numSnakeSections: 30,
                playerId: data.playerId,
                roomId: data.roomId,
                socket: this.socket,
                foodGroup: this.foodGroup, 
                snakeHeadCollisionGroup: this.snakeHeadCollisionGroup, 
                foodCollisionGroup: this.foodCollisionGroup
            });
        }
    }

    loadFood(data) {
        const width = this.game.width;
        const height = this.game.height;
        data.foods?.forEach(element => {
            this.initFood(Util.calFoodPosition(element.x, width), Util.calFoodPosition(element.y, height), element.index);
        });
    }

    shutdown() {
        // Cleanup logic here
        this.socket.emit('delete player', { 
            playerId: this.playerId,
            roomId: this.roomId,
         });
        
        // Close the socket connection if necessary
        if (this.socket) {
            setTimeout(() => {
                this.socket.disconnect();
            }, 10);
        }

        // Destroy game objects or groups
        if (this.foodGroup) {
            this.foodGroup.destroy();
        }

        // Clear any remaining timers or callbacks
        this.game.time.events.removeAll();
    }

}