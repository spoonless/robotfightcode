
//FightCode can only understand your robot
//if its class is called Robot
var Robot = function(robot) {
  this.mode = "";
  this.movement = 0;
  this.lastScannedRobot = null;
  this.targetOrientation = 1;
  this.scanningAngle = 15;
};

Robot.prototype.findTarget = function(robot) {
  if (this.lastScannedRobot != null) {
    var angle = (360 - findRotation(robot.position, this.lastScannedRobot.position)) % 360;
    var rotation = angle - robot.angle;
    rotation = rotation > 180 ? 180 - rotation : rotation;
    this.movement = 10;
    if (Math.abs(rotation) > 90) {
      rotation = 90 - rotation;
      this.movement = - this.movement;
    }
    if (rotation != 0) {
        this.targetOrientation = rotation > 0 ? 1 : -1;
    }
    robot.turn(rotation);
    this.lastScannedRobot = null
    return true;
  }
  return false;
}

Robot.prototype.onIdle = function(ev) {
  var robot = ev.robot;
  if (this.findTarget(robot)) {
    robot.fire(); // YAY! 
    this.mode = "berserk";
  }
  else if (this.mode != "berserk") {
    this.movement = 0
    robot.disappear();
    this.scanningAngle = Math.max(this.scanningAngle + 2, 15);
    robot.turn(this.targetOrientation * this.scanningAngle);
  }
  else {
    this.movement = this.movement + (this.movement > 0 ? -1 : 1);
    if (this.movement == 0) {
      this.mode = "";
    }
  }
  
  if (this.movement < 0) {
    robot.back(-this.movement);
    robot.turnRight(180);
  } else {
    robot.ahead(this.movement);
  }
};

Robot.prototype.onWallCollision = function(ev) {
  var robot = ev.robot;
  this.mode = "";
};

var findRotation = function (p1, p2) {
  var angle = Math.atan2(p1.x - p2.x, p1.y-p2.y);
  return angle / Math.PI * 180;
};

Robot.prototype.onScannedRobot = function(ev) {
  var robot = ev.robot;
  var scannedRobot = ev.scannedRobot;
  if (! scannedRobot.parentId) {
    this.lastScannedRobot = scannedRobot;
    this.scanningAngle = 0;
  }

};
