import Eye from "./eye"
export default class EyePair {
    constructor(game, head, scale) {
        this.game = game;
        this.head = head;
        this.scale = scale;
        this.eyes = [];
        this.debug = false;

        const offset = this.getOffset();
        this.leftEye = new Eye(this.game, this.head, this.scale);
        this.leftEye.updateConstraints([-offset.x, -offset.y]);
        this.eyes.push(this.leftEye);

        this.rightEye = new Eye(this.game, this.head, this.scale);
        this.rightEye.updateConstraints([offset.x, -offset.y]);
        this.eyes.push(this.rightEye);
    }

    getOffset() {
        const xDim = this.head.width * 0.25;
        const yDim = this.head.width * 0.125;
        return { x: xDim, y: yDim };
    }

    setScale(scale) {
        this.leftEye.setScale(scale);
        this.rightEye.setScale(scale);

        const offset = this.getOffset();
        this.leftEye.updateConstraints([-offset.x, -offset.y]);
        this.rightEye.updateConstraints([offset.x, -offset.y]);
    }

    update() {
        this.eyes.forEach(eye => {
            eye.update();
        });
    }

    destroy() {
        this.leftEye.destroy();
        this.rightEye.destroy();
    }
}