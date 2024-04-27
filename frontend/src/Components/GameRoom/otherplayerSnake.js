import Snake from './snake'; // Assuming 'Snake' is the class you are extending
import Phaser from "phaser-ce"

class OtherPlayerSnake extends Snake {
    constructor({ game, spriteKey, x, y, numSnakeSections, playerId, roomId, socket }) {

        super({ game, spriteKey, x, y, numSnakeSections, playerId, roomId, socket });

        this.game = game;
        this.snackaddCheck = this.snakeLength;
        // this.cursors = game.input.keyboard.createCursorKeys();
        // this.zoomStep = 0.01;
        // game.input.mouse.active = true;
        // game.input.mouse.mouseWheel = true;

        game.input.onDown.add(this.onMouseDown, this);
        game.input.onUp.add(this.onMouseUp, this);

        var domElement = game.canvas;
        // domElement.addEventListener('wheel', this.handleMouseWheel.bind(game));
        this.socket.on('otherplayer', (data) => {
            if (data.playerId = this.playerId) {
                this.setMybody(data);
            }
        });

        this.addDestroyedCallback(() => {
            game.input.onDown.remove(this.onMouseDown, this);
            game.input.onDown.remove(this.onMouseUp, this);
        });
    }

    update() {

        const headX = this.x;
        const headY = this.y;
        // console.log("Player-id", this.playerId);
        // console.log("Head-position", headX, headY);

        this.rotatePlayer(headX, headY);
        // this.socket.emit('rotate player', { 
        //     x: headX, 
        //     y: headY, 
        //     roomId:this.roomId, 
        //     playerId: this.playerId })
        this.movePlayer();

    }
    onMouseDown() {
        // this.speed = this.fastSpeed;
        // this.shadow.isLightingUp = true;
    }

    onMouseUp() {
        // this.speed = this.slowSpeed;
        // this.shadow.isLightingUp = false;
    }

    rotatePlayer(headX, headY) {

        const mousePosX = this.mousePosX;
        const mousePosY = this.mousePosY;

        let angle = (180 * Math.atan2(mousePosX - headX, mousePosY - headY) / Math.PI);

        if (angle > 0) {
            angle = 180 - angle;
        } else {
            angle = -180 - angle;
        }

        const dif = this.head.body.angle - angle;
        this.head.body.setZeroRotation();
        // if (this.cursors.left.isDown) {
        //     this.head.body.rotateLeft(this.rotationSpeed);
        // } else if (this.cursors.right.isDown) {
        //     this.head.body.rotateRight(this.rotationSpeed);
        // } else if ((dif < 0 && dif > -180) || dif > 180) {
        //     this.head.body.rotateRight(this.rotationSpeed);
        // } else if ((dif > 0 && dif < 180) || dif < -180) {
        //     this.head.body.rotateLeft(this.rotationSpeed);
        // }
    }

    movePlayer() {
        var speed = this.speed;
        this.head.body.moveForward(speed);
        //remove the last element of an array that contains points which
        //the head traveled through
        //then move this point to the front of the array and change its value
        //to be where the head is located
        this.headPath.pop();
        // var point = this.headPath.pop();
        // console.log("=============", point);
        // point.setTo(this.head.body.x, this.head.body.y);

        this.headPath.unshift({ x: this.x, y: this.y });

        //place each section of the snake on the path of the snake head,
        //a certain distance from the section before it
        var index = 0;
        var lastIndex = null;

        for (var i = 0; i < this.snakeLength; i++) {

            this.sections[i].body.x = this.headPath[index].x;
            this.sections[i].body.y = this.headPath[index].y;

            //hide sections if they are at the same position
            if (lastIndex && index == lastIndex) {
                this.sections[i].alpha = 0;
            }
            else {
                this.sections[i].alpha = 1;
            }

            lastIndex = index;
            //this finds the index in the head path array that the next point
            //should be at
            index = this.findNextPointIndex(index);
        }

        //continuously adjust the size of the head path array so that we
        //keep only an array of points that we need
        if (index >= this.headPath.length - 1) {
            var lastPos = this.headPath[this.headPath.length - 1];
            this.headPath.push(new Phaser.Point(lastPos.x, lastPos.y));
        }
        else {
            this.headPath.pop();
        }

        //this calls onCycleComplete every time a cycle is completed
        //a cycle is the time it takes the second section of a snake to reach
        //where the head of the snake was at the end of the last cycle
        var i = 0;
        var found = false;
        // while (this.headPath[i].x != this.sections[1].body.x &&
        // this.headPath[i].y != this.sections[1].body.y) {
        //     if (this.headPath[i].x == this.lastHeadPosition.x &&
        //     this.headPath[i].y == this.lastHeadPosition.y) {
        //         found = true;
        //         break;
        //     }
        //     i++;
        // }
        if (!found) {
            this.lastHeadPosition = new Phaser.Point(this.head.body.x, this.head.body.y);
            this.onCycleComplete();
        }

        //update the eyes and the shadow below the snake
        this.eyes.update();
        this.shadow.update();
    }

    setMybody(data) {
        this.x = data.headX;
        this.y = data.headY;
        this.mousePosX = data.mousePosX;
        this.mousePosY = data.mousePosY;
        this.speed = data.speed;
        this.headPath = data.headPath;
        if (this.snackaddCheck != data.snakeLength) {
            this.addSectionAtPosition(this.x, this.y);
        }
        this.snackaddCheck = data.snakeLength;
    }

}

export default OtherPlayerSnake;