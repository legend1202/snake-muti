const Util = require("../utils/math")
exports.FoodGroup = function (id, startX, startY, startColor, startSize) {
    var x = startX
    var y = startY
    var size = startSize
    var color = startColor
    var id = id

    // Define which variables and methods can be accessed
    return {
      x: x,
      y: y,
      size: size,
      color: color,
      id: id
    }
}
  

exports.generateFood = () => {

  for (var i = 0; i < 100; i++) {
      this.initFood(Util.randomInt(-width, width), Util.randomInt(-height, height));
  }

  return this.FoodGroup;
}