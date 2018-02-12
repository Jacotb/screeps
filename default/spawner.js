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
        workers: 8,
        miners: 8,
        haulers: 8,
        soldiers: 6,
        archers: 8,
        claimers: 4
    },

    tick: function (spawn, rooms, roomNames) {

        var self = this;
        if (spawn.room.energyAvailable >= 150 && !spawn.spawning) {
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
                availableRoles.push({role: this.Role.soldier, relSize: (_.size(soldiers) / Math.max(self.creepCount.soldiers - 1, 1))});
                availableRoles.push({role: this.Role.archer, relSize: (_.size(archers) / Math.max(self.creepCount.archers - 1, 1))});
            } else {
                if (workers.length < this.creepCount.workers) {
                    availableRoles.push({role: this.Role.worker, relSize: (_.size(workers) / Math.max(self.creepCount.workers - 1, 1))});
                }
                if (miners.length < this.creepCount.miners && _.size(workers) >= 3 && _.some(freeMiningContainers)) {
                    availableRoles.push({role: this.Role.miner, relSize: Math.min((_.size(miners) / Math.max(self.creepCount.miners - 1, 1)), 0.25)});
                }
                if (haulers.length < this.creepCount.haulers && _.size(workers) >= 3 && _.size(miners) >= 1) {
                    availableRoles.push({role: this.Role.hauler, relSize: (_.size(haulers) / Math.max(self.creepCount.haulers - 1, 1))});
                }
                if (soldiers.length < this.creepCount.soldiers && _.size(workers) >= 3) {
                    availableRoles.push({role: this.Role.soldier, relSize: (_.size(soldiers) / Math.max(self.creepCount.soldiers - 1, 1))});
                }
                if (archers.length < this.creepCount.archers && _.size(workers) >= 3) {
                    availableRoles.push({role: this.Role.archer, relSize: (_.size(archers) / Math.max(self.creepCount.archers - 1, 1))});
                }
                if (claimers.length < this.creepCount.claimers && _.size(workers) >= 3) {
                    availableRoles.push({role: this.Role.claimer, relSize: (_.size(claimers) / Math.max(self.creepCount.claimers - 1, 1))});
                }
            }

            if (_.some(availableRoles)) {
                var newCreepRole = _.sample(availableRoles);
                var maxSize = Math.max(newCreepRole.relSize * spawn.room.energyCapacityAvailable, spawn.room.energyAvailable);
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
        return _.sortBy(body, function(part) {
            return BODYPART_COST[part];
        });
    },

    bodyCost: function (body) {
        return body.reduce(function (cost, part) {
            return cost + BODYPART_COST[part];
        }, 0);
    }
};