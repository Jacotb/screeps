var utilMove = require('util.move');
var utilPosition = require('util.position');
var ul = require('util.lang');

module.exports = {
    Task: Object.freeze({build: 1, upgrade: 2, repair: 3, transfer: 4, harvest: 5, pickup: 6, withdraw: 7}),
    ANTICIPATE_SOURCE_REGENERATION_DURATION: 24,

    run: function (creep, rooms) {
        var taskOngoing = false;
        var iterations = 0;
        while (!taskOngoing) {
            iterations++;
            switch (creep.memory.task) {
                case this.Task.transfer:
                    taskOngoing = this.transfer(creep, rooms);
                    break;
                case this.Task.withdraw:
                    taskOngoing = this.withdraw(creep, rooms);
                    break;
                default:
                    break;
            }

            if (!taskOngoing) {
                creep.memory.task = this.findTask(creep, rooms);
                this.resetTaskMemory(creep);
            }

            if (iterations > 3) {
                creep.say('no task');
                break;
            }
        }
    },

    resetTaskMemory: function (creep) {
        delete creep.memory.transferTargetId;
        delete creep.memory.withdrawTargetId;
    },

    findTask: function (creep, rooms) {
        var potentialTasks = [];
        var self = this;

        if (creep.carry.energy === 0) {
            var containers = ul.flatMap(rooms, function (room) {
                return utilPosition.getMiningContainers(room);
            });
            if (_.some(containers, function (container) {
                    return container.store[RESOURCE_ENERGY] >= creep.carryCapacity;
                })) {
                potentialTasks.push(self.Task.withdraw);
            }
        } else {
            var structures = ul.flatMap(rooms, function (room) {
                return room.find(FIND_MY_STRUCTURES);
            });
            if (_.some(structures, function (structure) {
                    return ((structure.structureType === STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                        || (
                            (structure.structureType === STRUCTURE_SPAWN && structure.energy < structure.energyCapacity)
                            || (structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity)
                            || (structure.structureType === STRUCTURE_TOWER && structure.energy < structure.energyCapacity)
                        ))
                        && !_.some(_.filter(Game.creeps, function (gCreep) {
                            return gCreep.memory.role === "worker" && gCreep.memory.task === self.Task.transfer && gCreep.memory.transferTargetId === structure.id && (structure.energyCapacity - structure.energy) <= gCreep.carry.energy;
                        }));
                })) {
                potentialTasks.push(self.Task.transfer);
            }
        }

        return _.sample(potentialTasks);
    },

    transfer: function (creep, rooms) {
        var target;
        var self = this;

        if (creep.memory.transferTargetId === undefined) {
            var structures = ul.flatMap(rooms, function (room) {
                return room.find(FIND_MY_STRUCTURES);
            });

            target = utilPosition.findClosestByPathMultiRoom(creep.pos, _.filter(structures, function (structure) {
                return (
                    (structure.structureType === STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                    || (structure.structureType === STRUCTURE_SPAWN && structure.energy < structure.energyCapacity)
                    || (structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity)
                    || (structure.structureType === STRUCTURE_TOWER && structure.energy < structure.energyCapacity)
                );
            }));
            if (!target) {
                target = utilPosition.findClosestByPathMultiRoom(creep.pos, _.filter(structures, function (structure) {
                    return structure.energy < structure.energyCapacity && !_.some(_.filter(Game.creeps, function (gCreep) {
                        return (gCreep.memory.role === "worker" || gCreep.memory.role === "hauler")
                            && gCreep.memory.task === self.Task.transfer
                            && gCreep.memory.transferTargetId === structure.id
                            && (structure.energyCapacity - structure.energy) <= gCreep.carry.energy
                            && _.size(gCreep.pos.findPathTo(structure)) <= _.size(creep.pos.findPathTo(structure));
                    }));
                }));
            }
            if (target) {
                if (target.energyCapacity - target.energy <= creep.carry.energy) {
                    _.filter(Game.creeps, function (gCreep) {
                        return (gCreep.memory.role === "worker" || gCreep.memory.role === "hauler")
                            && gCreep.memory.task === self.Task.transfer
                            && gCreep.memory.transferTargetId === target.id;
                    }).forEach(function (gCreep) {
                        delete gCreep.memory.task;
                    });
                }
                creep.memory.transferTargetId = target.id;
            } else {
                return false;
            }
        } else {
            target = Game.getObjectById(creep.memory.transferTargetId);
            if (!target) {
                return false;
            }
        }

        if (creep.carry.energy <= 0) {
            return false;
        }

        if (target.energy >= target.energyCapacity) {
            return false;
        }

        var result = creep.transfer(target, RESOURCE_ENERGY, Math.min(target.energyCapacity - target.energy, creep.carry.energy));
        if (result === OK) {
            creep.say("🎁");
        } else if (result === ERR_NOT_IN_RANGE) {
            utilMove.run(creep, target, '#aa0000', '🎁');
        } else if (result === ERR_TIRED) {
            creep.say("😴🎁");
        } else {
            creep.say(result)
        }
        return true;
    },

    withdraw: function (creep, rooms) {
        var target;
        var self = this;

        if (creep.memory.withdrawTargetId === undefined) {
            var containers = _.filter(ul.flatMap(rooms, function (room) {
                return utilPosition.getMiningContainers(room);
            }), function (container) {
                return container.store[RESOURCE_ENERGY] >= creep.carryCapacity;
            });
            if (_.size(containers) === 0) {
                return false;
            }

            target = utilPosition.findClosestByPathMultiRoom(creep.pos, containers);
            if (target) {
                creep.memory.withdrawTargetId = target.id;
            } else {
                return false;
            }
        } else {
            target = Game.getObjectById(creep.memory.withdrawTargetId);
            if (!target) {
                return false;
            }
        }

        if (creep.carry.energy >= creep.carryCapacity) {
            return false;
        }

        var result = creep.withdraw(target, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy);
        if (result === OK) {
            creep.say('⛽');
        } else if (result === ERR_NOT_IN_RANGE) {
            utilMove.run(creep, target, '#ff0000', '⛽');
        } else if (result === ERR_TIRED) {
            creep.say("😴⛽");
        } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
            return false;
        } else {
            creep.say(result);
        }
        return true;
    }
};