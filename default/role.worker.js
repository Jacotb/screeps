var utilMove = require('util.move');
var utilPosition = require('util.position');
var ul = require('util.lang');

module.exports = {
    Task: Object.freeze({build: 1, upgrade: 2, repair: 3, transfer: 4, harvest: 5, pickup: 6, withdraw: 7, dismantle: 8}),
    ANTICIPATE_SOURCE_REGENERATION_DURATION: 24,

    run: function (creep, rooms) {
        var taskOngoing = false;
        var iterations = 0;
        while (!taskOngoing) {
            iterations++;
            switch (creep.memory.task) {
                case this.Task.build:
                    taskOngoing = this.build(creep, rooms);
                    break;
                case this.Task.upgrade:
                    taskOngoing = this.upgrade(creep, rooms);
                    break;
                case this.Task.repair:
                    taskOngoing = this.repair(creep, rooms);
                    break;
                case this.Task.transfer:
                    taskOngoing = this.transfer(creep, rooms);
                    break;
                case this.Task.withdraw:
                    taskOngoing = this.withdraw(creep, rooms);
                    break;
                case this.Task.harvest:
                    taskOngoing = this.harvest(creep, rooms);
                    break;
                case this.Task.pickup:
                    taskOngoing = this.pickup(creep, rooms);
                    break;
                case this.Task.dismantle:
                    taskOngoing = this.dismantle(creep, rooms);
                    break;
                default:
                    break;
            }

            if (!taskOngoing) {
                creep.memory.task = this.findTask(creep, rooms);
                this.resetTaskMemory(creep);
            }

            if (iterations > 1) {
                creep.say('no task');
                break;
            }
        }
    },

    resetTaskMemory: function (creep) {
        delete creep.memory.buildTargetId;
        delete creep.memory.upgradeTargetId;
        delete creep.memory.repairTargetId;
        delete creep.memory.transferTargetId;
        delete creep.memory.harvestTargetId;
        delete creep.memory.harvestSourceRegenerationRetargeted;
        delete creep.memory.withdrawTargetId;
        delete creep.memory.pickupTargetId;
    },

    findTask: function (creep, rooms) {
        var potentialTasks = [];
        var self = this;

        if (creep.carry.energy === 0) {
            var dropped = ul.flatMap(rooms, function (room) {
                return room.find(FIND_DROPPED_RESOURCES);
            });
            if (_.some(dropped, function (drop) {
                    return drop.resourceType === RESOURCE_ENERGY && !_.some(Game.creeps, function (gCreep) {
                        return gCreep.memory.role === "worker" && gCreep.memory.task === self.Task.pickup && gCreep.memory.pickupTargetId === drop.id;
                    });
                })) {
                potentialTasks.push(self.Task.pickup);
            }

            var flags = _.filter(ul.flatMap(rooms, function (room) {
                return room.find(FIND_FLAGS, {
                    filter: function (flag) {
                        return flag.memory.destroy === true && (flag.room.controller.my || flag.room.controller.safeMode === undefined);
                    }
                });
            }), function(flag){
                return flag !== undefined;
            });
            if (_.some(flags)) {
                potentialTasks.push(self.Task.dismantle);
            }

            var containers = ul.flatMap(rooms, function (room) {
                return utilPosition.getMiningContainers(room);
            });
            var storages = _.filter(ul.flatMap(rooms, function (room) {
                return room.storage;
            }), function(storage){
                return storage !== undefined;
            });
            if (_.some(containers, function (container) {
                    return container.store[RESOURCE_ENERGY] >= creep.carryCapacity;
                }) || _.some(storages, function (storage) {
                    return storage.store[RESOURCE_ENERGY] >= creep.carryCapacity;
                })) {
                potentialTasks.push(self.Task.withdraw);
            }

            if (!_.includes(potentialTasks, self.Task.withdraw)) {
                var sources = ul.flatMap(rooms, function (room) {
                    return room.find(FIND_SOURCES)
                });
                if (_.some(sources, function (source) {
                        return ((source.room.controller.my || source.room.controller.safeMode === undefined) && _.size(utilPosition.getSourceMiners(source)) + _.size(_.filter(Game.creeps, function (creep) {
                            return creep.memory.task === self.Task.harvest && creep.memory.harvestTargetId === source.id;
                        })) < _.size(utilPosition.getSourceMiningSpots(source)));
                    })) {
                    potentialTasks.push(self.Task.harvest);
                }
            }
        } else {
            if (Math.random() < 0.1) {
                potentialTasks.push(self.Task.upgrade);
            }

            var structures = ul.flatMap(rooms, function (room) {
                return room.find(FIND_MY_STRUCTURES);
            });
            if (_.some(structures, function (structure) {
                    return structure.energy < structure.energyCapacity && !_.some(_.filter(Game.creeps, function (gCreep) {
                        return (gCreep.memory.role === "worker" || gCreep.memory.role === "hauler") && gCreep.memory.task === self.Task.transfer && gCreep.memory.transferTargetId === structure.id && (structure.energyCapacity - structure.energy) <= gCreep.carry.energy;
                    }));
                })) {
                potentialTasks.push(self.Task.transfer);
            }

            if (!_.includes(potentialTasks, self.Task.transfer) || Math.random() < 0.2) {
                var consSites = ul.flatMap(rooms, function (room) {
                    return room.find(FIND_MY_CONSTRUCTION_SITES);
                });
                if (_.some(consSites)) {
                    potentialTasks.push(self.Task.build);
                }
            }

            var allStructures = ul.flatMap(rooms, function (room) {
                return room.find(FIND_STRUCTURES);
            });
            if (Math.random() < 0.4) {
                if (_.some(allStructures, function (structure) {
                        return structure.hits < structure.hitsMax / 1.33;
                    })) {
                    potentialTasks.push(self.Task.repair);
                }
            }
        }

        return _.sample(potentialTasks);
    },

    build: function (creep, rooms) {
        var target;
        var self = this;

        if (creep.memory.buildTargetId === undefined) {
            var consSites = _.take(ul.flatMap(rooms, function (room) {
                return room.find(FIND_MY_CONSTRUCTION_SITES);
            }), 8);
            target = utilPosition.findClosestByPathMultiRoom(creep.pos, consSites);
            if (target) {
                creep.memory.buildTargetId = target.id;
            } else {
                return false;
            }
        } else {
            target = Game.getObjectById(creep.memory.buildTargetId);
            if (!target) {
                return false;
            }
        }

        if (creep.carry.energy <= 0) {
            return false;
        }

        var result = creep.build(target);
        if (result === OK) {
            creep.say("🏗️");
        } else if (result === ERR_NOT_IN_RANGE) {
            return utilMove.run(creep, target, '#0000ff', '🏗️');
        } else if (result === ERR_INVALID_TARGET) {
            creep.room.lookForAt(LOOK_CREEPS, target.pos.x, target.pos.y).forEach(function (blocker) {
                blocker.move(_.sample([TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT]))
            });
        } else if (result === ERR_TIRED) {
            creep.say("😴🏗️");
        } else {
            creep.say(result);
        }
        return true;
    },

    upgrade: function (creep, rooms) {
        var target;
        var self = this;

        if (creep.memory.upgradeTargetId === undefined) {
            target = _.sample(_.filter(_.map(rooms, function (room) {
                return room.controller;
            }), function (controller) {
                return controller.my;
            }));
            if (target) {
                creep.memory.upgradeTargetId = target.id;
            } else {
                return false;
            }
        } else {
            target = Game.getObjectById(creep.memory.upgradeTargetId);
            if (!target) {
                return false;
            }
        }

        if (creep.carry.energy <= 0) {
            return false;
        }

        var result = creep.upgradeController(target);
        if (result === OK) {
            creep.say("⬆️");
        } else if (result === ERR_NOT_IN_RANGE) {
            return utilMove.run(creep, target, '#0000ff', '⬆️');
        } else if (result === ERR_TIRED) {
            creep.say("😴⬆️");
        } else {
            creep.say(result)
        }
        return true;
    },

    repair: function (creep, rooms) {
        var target;
        var self = this;

        if (creep.memory.repairTargetId === undefined) {
            var structures = _.take(ul.flatMap(rooms, function (room) {
                return room.find(FIND_STRUCTURES, {
                    filter: function (structure) {
                        return structure.hits < structure.hitsMax / 1.33 && structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_RAMPART;
                    }
                });
            }), 8);
            if (!_.some(structures)){
                structures = ul.flatMap(rooms, function (room) {
                    return room.find(FIND_STRUCTURES, {
                        filter: function (structure) {
                            return structure.hits < structure.hitsMax / 1.33;
                        }
                    });
                });
                if (!_.some(structures)){
                    return false;
                }
            }
            target = utilPosition.findClosestByPathMultiRoom(creep.pos, structures);
            if (target) {
                creep.memory.repairTargetId = target.id;
            } else {
                return false;
            }
        } else {
            target = Game.getObjectById(creep.memory.repairTargetId);
            if (!target) {
                return false;
            }
        }

        if (creep.carry.energy <= 0) {
            return false;
        }

        if (target.hits >= target.hitsMax) {
            return false;
        }

        var result = creep.repair(target);
        if (result === OK) {
            creep.say("🔧");
        } else if (result === ERR_NOT_IN_RANGE) {
            return utilMove.run(creep, target, '#00ff00', '🔧');
        } else if (result === ERR_TIRED) {
            creep.say("😴🔧");
        } else if (result === ERR_INVALID_TARGET) {
            return false;
        } else {
            creep.say(result);
        }
        return true;
    },

    transfer: function (creep, rooms) {
        var target;
        var self = this;

        if (creep.memory.transferTargetId === undefined) {
            var structures = _.take(ul.flatMap(rooms, function (room) {
                return room.find(FIND_MY_STRUCTURES);
            }), 8);

            target = utilPosition.findClosestByPathMultiRoom(creep.pos, _.filter(structures, function (structure) {
                return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN)
                    && structure.energy < structure.energyCapacity
                    && !_.some(_.filter(Game.creeps, function (gCreep) {
                        return (gCreep.memory.role === "worker" || gCreep.memory.role === "hauler")
                            && gCreep.memory.task === self.Task.transfer
                            && gCreep.memory.transferTargetId === structure.id
                            && (structure.energyCapacity - structure.energy) <= gCreep.carry.energy
                            && _.size(gCreep.pos.findPathTo(structure)) <= _.size(creep.pos.findPathTo(structure));

                    }));
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
            return utilMove.run(creep, target, '#aa0000', '🎁');
        } else if (result === ERR_TIRED) {
            creep.say("😴🎁");
        } else {
            creep.say(result)
        }
        return true;
    },

    harvest: function (creep, rooms) {
        var target;
        var self = this;

        var retarget = false;
        if (creep.memory.harvestTargetId === undefined) {
            retarget = true;
        }

        var sources = ul.flatMap(rooms, function (room) {
            return room.find(FIND_SOURCES);
        });
        if (!retarget && creep.memory.harvestSourceRegenerationRetargeted === undefined &&
            (_.some(sources, function (source) {
                return source.ticksToRegeneration < self.ANTICIPATE_SOURCE_REGENERATION_DURATION;
            }) || _.some(sources, function (source) {
                return source.energy === source.energyCapacity;
            }))
        ) {
            creep.memory.harvestSourceRegenerationRetargeted = true;
            retarget = true;
        }

        if (retarget) {
            target = self.findLeastUtilizedSource(creep, rooms);
            if (target) {
                creep.memory.harvestTargetId = target.id;
            } else {
                return false;
            }
        } else {
            target = Game.getObjectById(creep.memory.harvestTargetId);
            if (!target) {
                return false;
            }
        }

        if (creep.carry.energy >= creep.carryCapacity) {
            return false;
        }

        var result = creep.harvest(target);
        if (result === OK) {
            creep.say("⛏️");
        } else if (result === ERR_NOT_IN_RANGE) {
            return utilMove.run(creep, target, '#ff0000', '️⛏️');
        } else if (result === ERR_TIRED) {
            creep.say("😴️⛏️");
        } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
            if (target.ticksToRegeneration < this.ANTICIPATE_SOURCE_REGENERATION_DURATION) {
                return utilMove.run(creep, target, '#ff0000', '️⛏️');
            } else {
                return false;
            }
        } else if (result === ERR_NOT_OWNER) {
            creep.say("📒️⛏️");
            return false;
        } else {
            creep.say(result);
        }
        return true;
    },

    withdraw: function (creep, rooms) {
        var target;
        var self = this;

        if (creep.memory.withdrawTargetId === undefined) {
            var storages = _.filter(ul.flatMap(rooms, function (room) {
                return room.storage
            }), function(storage) {
                return storage !== undefined && storage.store[RESOURCE_ENERGY] >= creep.carryCapacity;
            });
            var containers = _.filter(ul.flatMap(rooms, function (room) {
                return _.filter(room.find(FIND_STRUCTURES), function(structure) {
                    return structure.structureType === STRUCTURE_CONTAINER;
                });
            }), function(container) {
                return container !== undefined && container.store[RESOURCE_ENERGY] >= creep.carryCapacity;
            });

            target = utilPosition.findClosestByPathMultiRoom(creep.pos, _.take(storages.concat(containers), 8));
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
            return utilMove.run(creep, target, '#ff0000', '⛽');
        } else if (result === ERR_TIRED) {
            creep.say("😴⛽");
        } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
            return false;
        } else if (result === ERR_NOT_OWNER && target.pos.room !== creep.room) {
            // bug if in another room
            return utilMove.run(creep, target, '#ff0000', '⛽');
        } else {
            creep.say(result);
        }
        return true;
    },

    pickup: function (creep, rooms) {
        var target;
        var self = this;

        if (creep.memory.pickupTargetId === undefined) {
            var dropped = _.filter(ul.flatMap(rooms, function (room) {
                return room.find(FIND_DROPPED_RESOURCES);
            }), function (drop) {
                return drop.resourceType === RESOURCE_ENERGY && !_.some(Game.creeps, function (gCreep) {
                    return gCreep.memory.role === "worker" && gCreep.memory.task === self.Task.pickup && gCreep.memory.pickupTargetId === drop.id;
                });
            });
            target = utilPosition.findClosestByPathMultiRoom(creep.pos, dropped);
            if (target) {
                creep.memory.pickupTargetId = target.id;
            } else {
                return false;
            }
        } else {
            target = Game.getObjectById(creep.memory.pickupTargetId);
            if (!target) {
                return false;
            }
        }

        if (creep.carry.energy >= creep.carryCapacity) {
            return false;
        }

        var result = creep.pickup(target);
        if (result === OK) {
            creep.say("🚜");
        } else if (result === ERR_NOT_IN_RANGE) {
            return utilMove.run(creep, target, '#ff0000', '🚜');
        } else if (result === ERR_TIRED) {
            creep.say("😴🚜");
        } else {
            creep.say(result)
        }
        return true;
    },

    dismantle: function (creep, rooms) {
        var target;
        var self = this;

        if (creep.memory.dismantleTargetId === undefined) {
            var flags = _.filter(ul.flatMap(rooms, function (room) {
                return room.find(FIND_FLAGS, {
                    filter: function (flag) {
                        return flag.memory.destroy === true;
                    }
                });
            }), function(flag){
                return flag !== undefined;
            });
            if (_.some(flags)) {
                //var flag = utilPosition.findClosestByPathMultiRoom(creep.pos, flags);
                var flag = _.sample(flags);
                target = _.first(flag.pos.lookFor(LOOK_STRUCTURES));
                if (target && !_.some(_.filter(Game.creeps, function (gCreep) {
                        return gCreep.memory.destroyTargetId === target.id || gCreep.memory.dismantleTargetId === target.id;
                    }))) {
                    creep.memory.dismantleTargetId = target.id;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            target = Game.getObjectById(creep.memory.dismantleTargetId);
            if (!target) {
                return false;
            }
        }

        if (creep.carry.energy >= creep.carryCapacity) {
            return false;
        }

        var result = creep.dismantle(target);
        if (result === OK) {
            creep.say("❌");
        } else if (result === ERR_NOT_IN_RANGE) {
            return utilMove.run(creep, target, '#ff0000', '❌');
        } else if (result === ERR_TIRED) {
            creep.say("😴❌");
        } else if (result === ERR_NO_BODYPART) {
            return false;
        } else {
            creep.say(result)
        }
        return true;
    },

    findLeastUtilizedSource: function (creep, rooms) {
        var self = this;

        var sources = ul.flatMap(rooms, function (room) {
            return room.find(FIND_SOURCES);
        });
        return _.first(_.sortBy(_.filter(sources, function (source) {
                return ((source.energy > 0 || source.ticksToRegeneration < this.ANTICIPATE_SOURCE_REGENERATION_DURATION) && _.size(utilPosition.getSourceMiners(source)) < _.size(utilPosition.getSourceMiningSpots(source)));
            }),
            function (source) {
                var nSpots = _.size(utilPosition.getSourceMiningSpots(source));

                var nCreeps = _.size(_.filter(Game.creeps, function (gCreep) {
                    return gCreep.memory.task === self.Task.harvest && gCreep.memory.harvestTargetId === source.id;
                })) + _.size(utilPosition.getSourceMiners(source));

                return nCreeps / (nSpots + 1);
            }));
    }
};