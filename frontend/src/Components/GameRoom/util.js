export default class Util {
    static randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static calFoodPosition(val, phy) {
        const min = Math.ceil(-phy);
        const max = Math.floor(phy);
        return Math.floor(val * (max - min + 1)) + min;
    }

    static distanceFormula(x1, y1, x2, y2) {
        const withinRoot = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
        const dist = Math.pow(withinRoot, 0.5);
        return dist;
    }
}