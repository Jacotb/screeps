var utilPosition = require('util.position');

module.exports = {
    levels: [
        {
            workerCount: 12,
            soldierCount: 5,
            archerCount: 2,
            worker: [WORK, CARRY, MOVE],
            soldier: [ATTACK, MOVE],
            archer: [RANGED_ATTACK, MOVE],
            miner: [WORK, WORK, MOVE]
        },
        {
            workerCount: 10,
            soldierCount: 3,
            archerCount: 3,
            worker: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
            soldier: [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE],
            archer: [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE],
            miner: [WORK, WORK, WORK, WORK, WORK, MOVE]
        },
        {
            workerCount: 8,
            soldierCount: 7,
            archerCount: 7,
            worker: [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY],
            soldier: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            archer: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE],
            miner: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE]
        }
    ],

    tick: function (spawn, rooms) {
        var level = this.getLevel(spawn);
        var workers = _.filter(Game.creeps, function (creep) {
            return creep.memory.role === 'worker'
        });
        var soldiers = _.filter(Game.creeps, function (creep) {
            return creep.memory.role === 'soldier'
        });
        var archers = _.filter(Game.creeps, function (creep) {
            return creep.memory.role === 'archer'
        });

        /*var extensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        var extensionConstructionSites = Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        var numExtensions = extensions.length + extensionConstructionSites.length*/

        if (workers.length < level.workerCount * _.size(rooms)) {
            spawn.spawnCreep(level.worker, spawn.name + "-" + Game.time, {memory: {role: 'worker'}})
        } else if (utilPosition.getFreeMiningContainer(spawn.room) !== undefined) {
            spawn.spawnCreep(level.miner, spawn.name + "-" + Game.time, {memory: {role: 'miner'}});
        } else if (soldiers.length < level.soldierCount * _.size(rooms)) {
            spawn.spawnCreep(level.soldier, spawn.name + "-" + Game.time, {
                memory: {
                    role: 'soldier',
                    target: _.sample(rooms).name
                }
            })
        } else if (archers.length < level.archerCount * _.size(rooms)) {
            spawn.spawnCreep(level.archer, spawn.name + "-" + Game.time, {
                memory: {
                    role: 'archer',
                    target: _.sample(rooms).name
                }
            })
        }
    },

    getLevel: function (spawn) {
        var max = spawn.room.energyCapacityAvailable;
        if (max < (300 + 5 * 50)) {
            return this.levels[0]
        } else if (max < (300 + 10 * 50)) {
            return this.levels[1]
        } else if (max < (300 + 20 * 50)) {
            return this.levels[2]
        } else {
            console.log("Update designs!");
            return this.levels[2]
        }
    }
};