var roleWorker = require('role.worker');
var roleSoldier = require('role.soldier');
var roleMiner = require('role.miner');
var towers = require('towers');
var cleaner = require('cleaner');
var spawner = require('spawner');
var builder = require('builder');

module.exports.loop = function () {
    var activeRooms = _.filter([
        Game.rooms['W79S83'],
        Game.rooms['W79S84']
    ], function(room){
      return room !== undefined;
    });
    
    cleaner.tick();
    
    var spawns = Game.spawns;
    _.forEach(spawns, function(spawn){
        spawner.tick(spawn);
    });
    
    activeRooms.forEach(function(room){
        builder.tick(room);
        towers.tick(room);
    });

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role === 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role === 'worker') {
            roleWorker.run(creep);
        }
        if(creep.memory.role === 'soldier') {
            roleSoldier.run(creep);
        }
        if(creep.memory.role === 'archer') {
            roleSoldier.run(creep);
        }
    }
};