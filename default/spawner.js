var utilPosition = require('util.position');
var ul = require('util.lang');

module.exports = {
    creepCount: {
        workers: 10,
        haulers: 3,
        soldiers: 5,
        archers: 4
    },

    tick: function (spawn, rooms, roomNames) {
        var miners = _.filter(Game.creeps, function (creep) {
            return creep.memory.role === 'miner'
        });
        var workers = _.filter(Game.creeps, function (creep) {
            return creep.memory.role === 'worker'
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

        if (workers.length < this.creepCount.workers && (workers.length < miners.length * 3)
            && (!_.some(storages) || workers.length < haulers.length * 4 || haulers.length >= this.creepCount.haulers * _.size(storages))) {
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
        }
    },

    getBody: function (creepType, spawn) {
        var max = spawn.room.energyAvailable;
        switch (creepType) {
            case 'worker':
                return this.createBody(max, [MOVE, WORK, MOVE, CARRY, CARRY]);
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