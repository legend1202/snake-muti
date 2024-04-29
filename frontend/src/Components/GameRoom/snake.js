import Phaser from "phaser-ce"
import Shadow from './shadow';
import EyePair from './eyePair'
import Util from './util'; // Import the Util class if needed

export default class Snake {

    constructor({ game, spriteKey, x, y, numSnakeSections, playerId, roomId, socket }) {
        this.game = game;
        
        if (!this.game.snakes) {
            this.game.snakes = [];
        }

        this.game.snakes.push(this);
        this.playerId = playerId;
        this.roomId = roomId;
        this.socket = socket;
        this.debug = false;
        this.snakeLength = 0;
        this.spriteKey = spriteKey;
        this.scale = 0.6;
        this.fastSpeed = 400;
        this.slowSpeed = 200;
        this.speed = this.slowSpeed;
        this.rotationSpeed = 90;
        this.collisionGroup = this.game.physics.p2.createCollisionGroup();
        this.sections = [];
        this.headPath = [];
        this.food = [];
        this.preferredDistance = 17 * this.scale;
        this.queuedSections = 0;
        this.shadow = new Shadow(this.game, this.sections, this.scale);
        this.sectionGroup = this.game.add.group();
        this.head = this.addSectionAtPosition(x, y);
        this.head.name = "head";
        this.head.snake = this;
        this.lastHeadPosition = new Phaser.Point(this.head.body.x, this.head.body.y);
        this.initSections(numSnakeSections);
        this.eyes = new EyePair(this.game, this.head, this.scale);
        this.edgeOffset = 4;
        this.edge = this.game.add.sprite(x, y - this.edgeOffset, this.spriteKey);
        this.edge.name = "edge";
        this.edge.alpha = 0;
        this.game.physics.p2.enable(this.edge, this.debug);
        this.edge.body.setCircle(this.edgeOffset);
        this.edgeLock = this.game.physics.p2.createLockConstraint(this.edge.body, this.head.body, [0, -this.head.width * 0.5 - this.edgeOffset]);
        this.edge.body.onBeginContact.add(this.edgeContact, this);
        this.onDestroyedCallbacks = [];
        this.onDestroyedContexts = [];
    }

    initSections(num) {
        for (let i = 1; i <= num; i++) {
            const x = this.head.body.x;
            const y = this.head.body.y + i * this.preferredDistance;
            this.addSectionAtPosition(x, y);
            this.headPath.push(new Phaser.Point(x, y));
        }
    }

    addSectionAtPosition(x, y) {
        const sec = this.game.add.sprite(x, y, this.spriteKey);
        this.game.physics.p2.enable(sec, this.debug);
        sec.body.setCollisionGroup(this.collisionGroup);
        sec.body.collides([]);
        sec.body.kinematic = true;
        this.snakeLength++;
        this.sectionGroup.add(sec);
        sec.sendToBack();
        sec.scale.setTo(this.scale);
        this.sections.push(sec);
        this.shadow.add(x, y);
        sec.body.clearShapes();
        sec.body.addCircle(sec.width * 0.5);
        return sec;
    }

    addSectionsAfterLast(amount) {
        this.queuedSections += amount;
    }

    findNextPointIndex(currentIndex) {
        let pt = this.headPath[currentIndex];
        let prefDist = this.preferredDistance;
        let len = 0;
        let dif = len - prefDist;
        let i = currentIndex;
        let prevDif = null;
        while (i + 1 < this.headPath.length && (dif === null || dif < 0)) {
            const dist = Util.distanceFormula(this.headPath[i].x, this.headPath[i].y, this.headPath[i + 1].x, this.headPath[i + 1].y);
            len += dist;
            prevDif = dif;
            dif = len - prefDist;
            i++;
        }
        if (prevDif === null || Math.abs(prevDif) > Math.abs(dif)) {
            return i;
        } else {
            return i - 1;
        }
    }

    onCycleComplete() {
        if (this.queuedSections > 0) {
            const lastSec = this.sections[this.sections.length - 1];
            this.addSectionAtPosition(lastSec.body.x, lastSec.body.y);
            this.queuedSections--;
        }
    }

    setScale(scale) {
        this.scale = scale;
        this.preferredDistance = 17 * this.scale;
        this.edgeLock.localOffsetB = [0, this.game.physics.p2.pxmi(this.head.width * 0.5 + this.edgeOffset)];
        for (let i = 0; i < this.sections.length; i++) {
            const sec = this.sections[i];
            sec.scale.setTo(this.scale);
            sec.body.data.shapes[0].radius = this.game.physics.p2.pxm(sec.width * 0.5);
        }
        this.eyes.setScale(scale);
        this.shadow.setScale(scale);
    }

    incrementSize() {
        this.addSectionsAfterLast(1);
        this.setScale(this.scale * 1.01);
    }

    destroy() {
        
        this.game.snakes.splice(this.game.snakes.indexOf(this), 1);
        this.game.physics.p2.removeConstraint(this.edgeLock);
        this.edge.destroy();
        
        for (let i = this.food.length - 1; i >= 0; i--) {
            this.food[i].destroy();
        }
        this.sections.forEach(sec => sec.destroy());
        this.eyes.destroy();
        this.shadow.destroy();
        for (let i = 0; i < this.onDestroyedCallbacks.length; i++) {
            if (typeof this.onDestroyedCallbacks[i] === "function") {
                this.onDestroyedCallbacks[i].apply(this.onDestroyedContexts[i], [this]);
            }
        }
    }

    edgeContact(phaserBody) {
        if (phaserBody && this.sections.indexOf(phaserBody.sprite) === -1) {
            this.destroy();
        } else if (phaserBody) {
            this.edge.body.x = this.head.body.x;
            this.edge.body.y = this.head.body.y;
        }
    }

    addDestroyedCallback(callback, context) {
        this.onDestroyedCallbacks.push(callback);
        this.onDestroyedContexts.push(context);
    }
}