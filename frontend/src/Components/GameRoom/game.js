import Phaser from "phaser-ce"
import Util from "./util"
import PlayerSnake from './playerSnake'
import OtherPlayerSnake from "./otherplayerSnake"
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

        this.socket = io('http://localhost:8000');
        var width = this.game.width;
        var height = this.game.height;
        this.game.world.setBounds(-width, -height, width * 2, height * 2);
        this.game.stage.backgroundColor = '#444';

        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.foodGroup = this.game.add.group();
        this.snakeHeadCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.foodCollisionGroup = this.game.physics.p2.createCollisionGroup();


        // Create New Player Object
        var snake = new PlayerSnake({
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
            var snake = this.game.snakes[i];
            // console.log(snake);
            snake.head.body.setCollisionGroup(this.snakeHeadCollisionGroup);
            snake.head.body.collides([this.foodCollisionGroup]);
            snake.addDestroyedCallback(this.snakeDestroyed, this);
        }

        // Add food randomly
        for (var i = 0; i < 100; i++) {
            // console.log("Generate Food Group, X, Y:", Util.randomInt(-width, width), Util.randomInt(-height, height));
            this.initFood(Util.randomInt(-width, width), Util.randomInt(-height, height));
        }

        // Socket connection successful
        this.socket.on('connect', this._onSocketConnected.bind(this))

        // New player message received
        this.socket.on('food group', this._onFoodGroup.bind(this))

        this.socket.on('rotate player', this._onRotatePlayer.bind(this))
        this.socket.on('otherplayer', this._onRotatePlayer.bind(this))

        // Socket disconnection
        this.socket.on('disconnect', this._onSocketDisconnect.bind(this))

        // New player message received
        this.socket.on('player joined', this._onNewPlayer.bind(this))

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

    initFood(x, y, tint) {
        var f = new Food(this.game, x, y, tint);
        f.sprite.body.setCollisionGroup(this.foodCollisionGroup);
        this.foodGroup.add(f.sprite);
        f.sprite.body.collides([this.snakeHeadCollisionGroup]);
        return f;
    }

    snakeDestroyed(snake) {
        // console.log("Snake Destroyed", snake)
        for (var i = 0; i < snake.headPath.length; i += Math.round(snake.headPath.length / snake.snakeLength) * 2) {
            this.initFood(
                snake.headPath[i].x + Util.randomInt(-10, 10),
                snake.headPath[i].y + Util.randomInt(-10, 10)
            );
        }
    }

    _onSocketConnected() {

        // Send local player data to the game server
        // console.log('_onSocketConnected Connected to socket server')
        console.log('socket connected')

        this.socket.emit('new player', {
            spriteKey: 'circle',
            x: this.newSnake.head.x,
            y: this.newSnake.head.y,
            numSnakeSections: this.newSnake.sections.length,
            playerId: this.newSnake.playerId,
            roomId: this.newSnake.roomId,
        });
    }

    //Player start rotating with the data from server
    _onRotatePlayer(res) {
        console.log("Player started moving:", res);

        for (const player of this.game.snakes) {
            if (player.playerId === res.playerId && player.roomId === res.roomId && player.snake) {
                player.snake.rotatePlayer(res.headX, res.headY)
                break;
            }
        }
    }

    _onFoodGroup(foodGroup) {
        // Add food randomly
        // for (var i = 0; i < 100; i++) {
        //     console.log("Generate Food Group, X, Y:", Util.randomInt(-width, width), Util.randomInt(-height, height));
        //     this.initFood(Util.randomInt(-width, width), Util.randomInt(-height, height));
        // }
    }

    _onSocketDisconnect(data) {
        console.log("Someone left room!", data);

    }

    handleNewPlayer(data) {
        if (data.playerId != this.playerId) {
            console.log("exits players", this.playerId, data.playerId);

            new OtherPlayerSnake({
                game: this.game,
                spriteKey: 'circle',
                x: data.x,
                y: data.y,
                numSnakeSections: 30,
                playerId: data.playerId,
                roomId: data.roomId,
                socket: this.socket
            });

        }
    }

    _onNewPlayer(data) {
        console.log("new player", this.playerId, data.playerId);

        // Avoid possible duplicate players in room
        var duplicate = this.game.snakes.find(function (player) {
            return player.playerId === data.playerId
        });

        // console.log("Duplicated Player:", duplicate);

        if (duplicate) {
            // console.log('Duplicate player!')
            return

        } else {

            new OtherPlayerSnake({
                game: this.game,
                spriteKey: 'circle',
                x: 0,
                y: 0,
                numSnakeSections: 30,
                playerId: data.playerId,
                roomId: data.roomId,
                socket: this.socket
            });
            console.log(this.game.snakes)
        }
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