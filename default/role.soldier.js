var utilMove = require('util.move');

module.exports = {
    run: function (creep) {
        if (creep.room.name === creep.memory.target) {
            var attacked = false;

            var nmCreeps = _.filter(creep.room.find(FIND_CREEPS), function (creep) {
                return !creep.my;
            });
            target = creep.pos.findClosestByPath(nmCreeps);
            if (!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES)
            }
            if (target) {
                result = creep.attack(target);
                if (result === OK) {
                    attacked = true;
                } else if (result === ERR_NOT_IN_RANGE) {
                    if (utilMove.run(creep, target, "#ffffff", "🔫")) {
                        attacked = true;
                    }
                } else if (result === ERR_NO_BODYPART) {
                    result = creep.rangedAttack(target);
                    if (result === OK) {
                        attacked = true;
                    } else if (result === ERR_NO_BODYPART) {
                        if (utilMove.run(creep, target, "#ffffff", "🔫")) {
                            attacked = true;
                        }
                    } else if (result === ERR_NOT_IN_RANGE) {
                        if (utilMove.run(creep, target, "#ffffff", "🔫")) {
                            attacked = true;
                        }
                    } else {
                        creep.say(result);
                    }
                } else {
                    creep.say(result);
                }
            }

            if (!attacked) {
                var moveTarget;
                if (creep.memory.moveTarget === undefined) {
                    moveTarget = Game.rooms[creep.memory.target].getPositionAt(Math.round(Math.random() * 50), Math.round(Math.random() * 50));
                    creep.memory.moveTarget = moveTarget;
                } else {
                    moveTarget = Game.rooms[creep.memory.moveTarget.roomName].getPositionAt(creep.memory.moveTarget.x, creep.memory.moveTarget.y);
                }
                var result = utilMove.run(creep, moveTarget, "#ffffff", "");
                if (!result) {
                    delete creep.memory.moveTarget;
                }
            }
        } else {
            var route = Game.map.findRoute(creep.room, creep.memory.target);
            if (route.length > 0) {
                creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
            }
        }
    }
};