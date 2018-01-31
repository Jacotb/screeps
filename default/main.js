var roleWorker = require('role.worker');
var roleHauler = require('role.hauler');
var roleSoldier = require('role.soldier');
var roleMiner = require('role.miner');
var roleClaimer = require('role.claimer');
var towers = require('towers');
var cleaner = require('cleaner');
var spawner = require('spawner');
var builder = require('builder');

var roomNames = [
    'W79S83',
    'W78S83'
];

module.exports.loop = function () {
    var activeRooms = _.filter(_.map(roomNames, function (roomName) {
        return Game.rooms[roomName];
    }), function (room) {
        return room !== undefined;
    });

    cleaner.tick();

    var spawns = Game.spawns;
    _.forEach(spawns, function (spawn) {
        spawner.tick(spawn, activeRooms, roomNames);
    });

    activeRooms.forEach(function (room) {
        builder.tick(room);
        towers.tick(room);
    });

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role === 'miner') {
            roleMiner.run(creep, activeRooms);
        }
        if (creep.memory.role === 'worker') {
            roleWorker.run(creep, activeRooms);
        }
        if (creep.memory.role === 'hauler') {
            roleHauler.run(creep, activeRooms);
        }
        if (creep.memory.role === 'soldier') {
            roleSoldier.run(creep);
        }
        if (creep.memory.role === 'archer') {
            roleSoldier.run(creep);
        }
        if (creep.memory.role === 'claimer') {
            roleClaimer.run(creep, activeRooms);
        }
    }
};