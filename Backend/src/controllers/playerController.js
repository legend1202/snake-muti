/* ************************************************
** GAME PLAYER CLASS
************************************************ */
exports.Player = function (headX, headY, playerId, roomId) {

  var x = headX
    var y = headY
    // var numSnakeSections = startSections
    var id = playerId;
    var roomId;
  
    // Getters and setters
    var getX = function () {
      return x
    }

    var getY = function () {
      return y
    }
    var getSections = function () {
      return numSnakeSections
    }
    var getAngle = function (angle) {
      return angle
    }
  
    var setX = function (newX) {
      x = newX
    }
  
    var setY = function (newY) {
      y = newY
    }

    var setAngle = function (angle) {
      return angle
    }
  
    var grow = function(size) {
      numSnakeSections = numSnakeSections + size
    }
  
    // Define which variables and methods can be accessed
    return {
      id: id,
      roomId: roomId,
      getX: getX,
      getY: getY,
      getSections: getSections,
      getAngle:getAngle,
      setX: setX,
      setY: setY,
      setAngle:setAngle,
      grow: grow,

    }
}