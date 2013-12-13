
//FightCode can only understand your robot
//if its class is called Robot
var Robot = function(robot) {
  this.scannedRobot = null;
  this.counter = 0
}

Robot.prototype.onIdle = function(ev) {
  var robot = ev.robot;
  var arenaCenter = {"x":robot.arenaWidth/2, "y" :robot.arenaHeight/2}
  if (! this.scannedRobot) {
    this.orient(robot, arenaCenter);
    robot.move(8);
    robot.rotateCannon(5);
  }
  else {
    if (this.lock(robot, this.scannedRobot.position)) {
      robot.fire();
    }
    var distance = getDistance(robot.position, this.scannedRobot.position)

    if (this.orient(robot, this.scannedRobot.position, distance < 150 ? 90 : 0)) {
    }
    robot.move(1);
    this.counter--
    if (this.counter == 0)
        this.scannedRobot = null;
  }
}

Robot.prototype.onWallCollision = function(ev) {

};

Robot.prototype.onScannedRobot = function(ev) {
    this.scannedRobot = ev.scannedRobot;
    this.counter = Math.min(70, this.counter + 70);
    ev.robot.stop();
}

function getAngle (origin, target) {
  var angle = Math.atan2(origin.y - target.y, origin.x - target.x); 
  return ((angle * 180) / Math.PI); 
}

function getDistance (p1, p2) {
  var dx = p1.x - p2.x;
  var dy = p1.y - p2.y;
  return Math.sqrt((dx*dx) + (dy*dy));
}

function getAngleIncrement(currentAngle, targetAngle) {
  var diffAngle = (targetAngle - currentAngle) % 360;
  if (Math.abs(diffAngle) > 1) {
    var rotation = 1;
    if (Math.abs(diffAngle) > 180) {
      rotation = -rotation;
    }
    if (diffAngle < 0) {
      rotation = -rotation;
    }
    return rotation; 
  }
  return 0;
}

Robot.prototype.orient = function(robot, position, angle) {
  angle = angle ? angle : 0;
  var increment = getAngleIncrement(robot.angle + 90 + angle, getAngle(robot.position, position));
  robot.turn(increment);
  return increment == 0;
}

Robot.prototype.lock = function(robot, position) {
  var increment = getAngleIncrement(robot.cannonAbsoluteAngle, getAngle(robot.position, position));
  robot.rotateCannon(increment);
  return increment == 0;
}
