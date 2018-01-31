var utilPosition = require('util.position');
var ul = require('util.lang');

module.exports = {
    Role: {
        worker: 1,
        miner: 2,
        hauler: 3,
        soldier: 4,
        archer: 5
    },

    creepCount: {
        workers: 12,
        miners: 5,
        haulers: 4,
        soldiers: 6,
        archers: 6
    },

    tick: function (spawn, rooms, roomNames) {
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
        var storages = _.filter(ul.flatMap(rooms, function(room){
            return room.storage;
        }), function(stor){
            return stor !== undefined;
        });

        var availableRoles = [];
        if (workers.length < this.creepCount.workers) {
            availableRoles.push(this.Role.worker);
        }
        if (miners.length < this.creepCount.miners && _.size(workers) >= 3) {
            availableRoles.push(this.Role.miner);
        }
        if (haulers.length < this.creepCount.haulers && _.size(workers) >= 3 && _.size(miners) >= 1) {
            availableRoles.push(this.Role.hauler);
        }
        if (soldiers.length < this.creepCount.soldiers && _.size(workers) >= 3) {
            availableRoles.push(this.Role.soldier);
        }
        if (archers.length < this.creepCount.archers && _.size(workers) >= 3) {
            availableRoles.push(this.Role.archer);
        }

        console.log(availableRoles);

        var newCreepRole = _.sample(availableRoles);
        switch(newCreepRole){
            case this.Role.worker:
                spawn.spawnCreep(this.getBody('worker', spawn), spawn.name + "-" + Game.time, {memory: {role: 'worker'}});
                break;
            case this.Role.miner:
                spawn.spawnCreep(this.getBody('miner', spawn), spawn.name + "-" + Game.time, {memory: {role: 'miner'}});
                break;
            case this.Role.hauler:
                spawn.spawnCreep(this.getBody('hauler', spawn), spawn.name + "-" + Game.time, {memory: {role: 'hauler',
                        target: _.sample(storages).room
                    }});
                break;
            case this.Role.soldier:
                spawn.spawnCreep(this.getBody('soldier', spawn), spawn.name + "-" + Game.time, {memory: {role: 'soldier',
                        target: _.sample(roomNames)
                    }});
                break;
            case this.Role.archer:
                spawn.spawnCreep(this.getBody('archer', spawn), spawn.name + "-" + Game.time, {memory: {role: 'archer',
                        target: _.sample(roomNames)
                    }});
                break;
        }



        /*if (workers.length < this.creepCount.workers && (workers.length < (miners.length + 1) * 3)
            && (!_.some(storages) || workers.length < (haulers.length + 1) * 3 || haulers.length >= this.creepCount.haulers * _.size(storages))) {
            spawn.spawnCreep(this.getBody('worker', spawn), spawn.name + "-" + Game.time, {memory: {role: 'worker'}})
        } else if (_.some(ul.flatMap(rooms, function (room) {
                return utilPosition.getFreeMiningContainer(room);
            }), function (container) {
                return container !== undefined;
            })) {
            spawn.spawnCreep(this.getBody('miner', spawn), spawn.name + "-" + Game.time, {memory: {role: 'miner'}});
        } else if (haulers.length < this.creepCount.haulers * _.size(storages)) {
            spawn.spawnCreep(this.getBody('hauler', spawn), spawn.name + "-" + Game.time, {
                memory: {
                    role: 'hauler',
                    target: _.sample(storages).room
                }
            })
        }  else if (soldiers.length < this.creepCount.soldiers) {
            spawn.spawnCreep(this.getBody('soldier', spawn), spawn.name + "-" + Game.time, {
                memory: {
                    role: 'soldier',
                    target: _.sample(roomNames)
                }
            })
        } else if (archers.length < this.creepCount.archers) {
            spawn.spawnCreep(this.getBody('archer', spawn), spawn.name + "-" + Game.time, {
                memory: {
                    role: 'archer',
                    target: _.sample(roomNames)
                }
            })
        }*/
    },

    getBody: function (creepType, spawn) {
        var max = spawn.room.energyAvailable;
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