var utilPosition = require('util.position');
var ul = require('util.lang');

module.exports = {
    Role: {
        worker: 1,
        miner: 2,
        hauler: 3,
        soldier: 4,
        archer: 5,
        claimer: 6
    },

    creepCount: {
        workers: 12,
        miners: 7,
        haulers: 6,
        soldiers: 10,
        archers: 8,
        claimers: 2
    },

    tick: function (spawn, rooms, roomNames) {

        var self = this;
        if (spawn.room.energyAvailable >= 150) {
            var workers = _.filter(Game.creeps, function (creep) {
                return creep.memory.role === 'worker'
            });
            var miners = _.filter(Game.creeps, function (creep) {
                return creep.memory.role === 'miner'
            });
            var haulers = _.filter(Game.creeps, function (creep) {
                return creep.memory.role === 'hauler'
            });
            var soldiers = _.filter(Game.creeps, function (creep) {
                return creep.memory.role === 'soldier'
            });
            var archers = _.filter(Game.creeps, function (creep) {
                return creep.memory.role === 'archer'
            });
            var claimers = _.filter(Game.creeps, function (creep) {
                return creep.memory.role === 'claimer'
            });
            var storages = _.filter(ul.flatMap(rooms, function (room) {
                return room.storage;
            }), function (stor) {
                return stor !== undefined;
            });
            var freeMiningContainers = _.filter(ul.flatMap(rooms, function (room) {
                return utilPosition.getFreeMiningContainer(room);
            }), function (container) {
                return container !== undefined;
            });
            var hostiles = spawn.room.find(FIND_HOSTILE_CREEPS);

            var availableRoles = [];
            if (_.some(hostiles)) {
                availableRoles.push({role: this.Role.soldier, relSize: (_.size(soldiers) / self.creepCount.soldiers)});
                availableRoles.push({role: this.Role.archer, relSize: (_.size(archers) / self.creepCount.archers)});
            } else {
                if (workers.length < this.creepCount.workers) {
                    availableRoles.push({role: this.Role.worker, relSize: (_.size(workers) / self.creepCount.workers)});
                }
                if (miners.length < this.creepCount.miners && _.size(workers) >= 3 && _.some(freeMiningContainers)) {
                    availableRoles.push({role: this.Role.miner, relSize: (_.size(miners) / self.creepCount.miners)});
                }
                if (haulers.length < this.creepCount.haulers && _.size(workers) >= 3 && _.size(miners) >= 1) {
                    availableRoles.push({role: this.Role.hauler, relSize: (_.size(haulers) / self.creepCount.haulers)});
                }
                if (soldiers.length < this.creepCount.soldiers && _.size(workers) >= 3) {
                    availableRoles.push({role: this.Role.soldier, relSize: (_.size(soldiers) / self.creepCount.soldiers)});
                }
                if (archers.length < this.creepCount.archers && _.size(workers) >= 3) {
                    availableRoles.push({role: this.Role.archer, relSize: (_.size(archers) / self.creepCount.archers)});
                }
                if (claimers.length < this.creepCount.claimers && _.size(workers) >= 3) {
                    availableRoles.push({role: this.Role.claimer, relSize: (_.size(claimers) / self.creepCount.claimers)});
                }
            }

            if (_.some(availableRoles)) {
                var newCreepRole = _.sample(availableRoles);
                var maxSize = newCreepRole.relSize * spawn.room.energyCapacityAvailable;
                switch (newCreepRole.role) {
                    case this.Role.worker:
                        spawn.spawnCreep(this.getBody('worker', spawn, maxSize), spawn.name + "-" + Game.time, {memory: {role: 'worker'}});
                        break;
                    case this.Role.miner:
                        spawn.spawnCreep(this.getBody('miner', spawn, maxSize), spawn.name + "-" + Game.time, {memory: {role: 'miner'}});
                        break;
                    case this.Role.hauler:
                        spawn.spawnCreep(this.getBody('hauler', spawn, maxSize), spawn.name + "-" + Game.time, {
                            memory: {
                                role: 'hauler',
                                target: _.sample(storages).room
                            }
                        });
                        break;
                    case this.Role.soldier:
                        spawn.spawnCreep(this.getBody('soldier', spawn, maxSize), spawn.name + "-" + Game.time, {
                            memory: {
                                role: 'soldier',
                                target: _.sample(roomNames)
                            }
                        });
                        break;
                    case this.Role.archer:
                        spawn.spawnCreep(this.getBody('archer', spawn, maxSize), spawn.name + "-" + Game.time, {
                            memory: {
                                role: 'archer',
                                target: _.sample(roomNames)
                            }
                        });
                        break;
                    case this.Role.claimer:
                        spawn.spawnCreep(this.getBody('claimer', spawn, maxSize), spawn.name + "-" + Game.time, {
                            memory: {
                                role: 'claimer'
                            }
                        });
                        break;
                }
            }
        }
    },

    getBody: function (creepType, spawn, max) {
        switch (creepType) {
            case 'worker':
                return this.createBody(max, [MOVE, WORK, CARRY]);
            case 'hauler':
                return this.createBody(max, [MOVE, CARRY, CARRY]);
            case 'soldier':
                return this.createBody(max, [MOVE, ATTACK]);
            case 'archer':
                return this.createBody(max, [MOVE, RANGED_ATTACK]);
            case 'miner':
                return this.createBody(max, [MOVE, WORK, WORK]);
            case 'claimer':
                return this.createBody(max, [MOVE, CLAIM]);

        }
    },

    createBody: function (maxEnergy, sequence) {
        var body = [];
        var testBody = [];
        var sequenceI = 0;
        while (this.bodyCost(testBody) <= maxEnergy || testBody.length <= sequence.length) {
            body = testBody.slice(0);
            testBody.push(sequence[sequenceI]);
            sequenceI = (sequenceI + 1) % sequence.length;
        }
        return body;
    },

    bodyCost: function (body) {
        return body.reduce(function (cost, part) {
            return cost + BODYPART_COST[part];
        }, 0);
    }
};