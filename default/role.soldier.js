var utilMove = require('util.move');

module.exports = {
    run: function (creep) {
        if (creep.room.name === creep.memory.target) {
            if (creep.room.controller.my || creep.room.controller.safeMode === undefined) {
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

                if (!target) {
                    var flags = creep.room.find(FIND_FLAGS, {
                        filter: function (flag) {
                            return flag.memory.destroy === true;
                        }
                    });
                    if (_.some(flags)) {
                        var flag = creep.pos.findClosestByPath(flags);
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
        } else {
            var route = Game.map.findRoute(creep.room, creep.memory.target);
            if (route.length > 0) {
                creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
            }
        }
    }
};