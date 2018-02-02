var utilMove = require('util.move');
var utilPosition = require('util.position');
var ul = require('util.lang');

module.exports = {
    run: function (creep, rooms) {
        var attacked = false;

        if (creep.room.controller.my || creep.room.controller.safeMode === undefined) {
            var nmCreeps = _.filter(ul.flatMap(rooms, function (room) {
                return room.find(FIND_HOSTILE_CREEPS);
            }), function (creep) {
                return creep !== undefined;
            });
            var nmStructures = _.filter(creep.room.find(FIND_HOSTILE_STRUCTURES), function (structure) {
                return structure.structureType !== STRUCTURE_CONTROLLER;
            });
            var flags = creep.room.find(FIND_FLAGS, {
                filter: function (flag) {
                    return flag.memory.destroy === true;
                }
            });
            var targets = nmCreeps.concat(nmStructures).concat(flags);
            target = utilPosition.findClosestByPathMultiRoom(creep.pos, targets);

            if (target instanceof Creep || target instanceof Structure) {
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
            } else if (target instanceof Flag) {
                var flag = utilPosition.findClosestByPathMultiRoom(creep.pos, flags);
                var target = _.first(flag.pos.lookFor(LOOK_STRUCTURES));
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
                } else {
                    flag.remove();
                }
            }
        }

        if (!attacked) {
            var moveTarget;
            if (creep.memory.moveTarget === undefined || creep.memory.moveTarget === null || creep.memory.moveTarget.roomName === undefined) {
                moveTarget = Game.rooms[creep.memory.target].getPositionAt(Math.round(Math.random() * 50), Math.round(Math.random() * 50));
                creep.memory.moveTarget = moveTarget;
            } else {
                moveTarget = Game.rooms[creep.memory.moveTarget.roomName].getPositionAt(creep.memory.moveTarget.x, creep.memory.moveTarget.y);
            }
            if (!creep.pos.isEqualTo(moveTarget)) {
                var result = utilMove.run(creep, moveTarget, "#ffffff", "");
                if (!result) {
                    delete creep.memory.moveTarget;
                }
            }
        }
    }
};