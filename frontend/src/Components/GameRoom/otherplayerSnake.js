import Snake from './snake'; // Assuming 'Snake' is the class you are extending
import Phaser from "phaser-ce";
import ExtraFood from './extraFood';

class OtherPlayerSnake extends Snake {
    constructor({ game, spriteKey, x, y, numSnakeSections, playerId, roomId, socket, foodGroup, snakeHeadCollisionGroup, foodCollisionGroup }) {
        
        super({ game, spriteKey, x, y, numSnakeSections, playerId, roomId, socket });
        
        this.game = game;
        this.foodGroup = foodGroup;
        this.snakeHeadCollisionGroup = snakeHeadCollisionGroup;
        this.foodCollisionGroup = foodCollisionGroup;

        this.socket.on('rotate player', this.setMybody.bind(this));
        this.socket.on('delete player', this.delete.bind(this));

    }

    
    update() {

        const headX = this.head.body.x;
        const headY = this.head.body.y;

        this.rotatePlayer(headX, headY);
        
        this.movePlayer();

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

        this.head.body.setZeroRotation();
    }

    movePlayer() {
        const speed = this.speed;
        this.head.body.moveForward(speed);
        
        this.headPath.unshift({x:this.x, y:this.y});

        //place each section of the snake on the path of the snake head,
        //a certain distance from the section before it
        let index = 0;
        let lastIndex = null;
        for (let i = 0 ; i < this.snakeLength ; i++) {

            this.sections[i].body.x = this.headPath[index].x;
            this.sections[i].body.y = this.headPath[index].y;

            //hide sections if they are at the same position
            if (lastIndex && index === lastIndex) {
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
            const lastPos = this.headPath[this.headPath.length - 1];
            this.headPath.push(new Phaser.Point(lastPos.x, lastPos.y));
        }
        else {
            this.headPath.pop();
        }

        //this calls onCycleComplete every time a cycle is completed
        //a cycle is the time it takes the second section of a snake to reach
        //where the head of the snake was at the end of the last cycle
        const found = false;
        if (!found) {
            this.lastHeadPosition = new Phaser.Point(this.head.body.x, this.head.body.y);
            this.onCycleComplete();
        }

        //update the eyes and the shadow below the snake
        this.eyes.update();
        this.shadow.update();
    }

    setMybody(data){
        if (data.playerId === this.playerId) {
            this.x = data.headX;
            this.y = data.headY;
            this.mousePosX= data.mousePosX;
            this.mousePosY = data.mousePosY;
            this.speed = data.speed;
            this.headPath = data.headPath;
            if (this.snackaddCheck !== data.snakeLength) {
                this.addSectionAtPosition(this.x, this.y);
            }
            this.snackaddCheck = data.snakeLength;
        }
    }
    generateExtraFood(x, y) {
        var f = new ExtraFood(this.game, x, y);
        f.sprite.body.setCollisionGroup(this.foodCollisionGroup);
        this.foodGroup.add(f.sprite);
        f.sprite.body.collides([this.snakeHeadCollisionGroup]);
        return f;
    }

    delete(data){
        if (this.playerId === data.playerId) {
            this.socket.emit("generate food", this.headPath);
            
            this.headPath?.forEach((element, index) => {
                if (index % 6 === 0) {
                    this.generateExtraFood(element.x, element.y);
                }
            });
            this.destroy();
        }
    }

}

export default OtherPlayerSnake;