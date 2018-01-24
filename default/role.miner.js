var utilMove = require('util.move');
var utilPosition = require('util.position');

module.exports = {
    run: function(creep) {
        var container;
        if (creep.memory.energySourceId === undefined){
            if (creep.memory.miningContainerId === undefined){
                container = utilPosition.getFreeMiningContainer(creep.room);
                if (container) {
                    creep.memory.miningContainerId = container.id;
                } else {
                    creep.say('?');
                    return;
                }
            } else {
                container = Game.getObjectById(creep.memory.miningContainerId);
                if (!container) {
                    creep.say('??');
                    return;
                }
            }
            
            if (!creep.pos.isEqualTo(container.pos)){
                utilMove.run(creep, container.pos, "#999900", "⛏️");
                return;
            } else {
                creep.memory.energySourceId = creep.pos.findClosestByRange(FIND_SOURCES).id;
            }
        }
        
        container = Game.getObjectById(creep.memory.miningContainerId);
        if (_.sum(container.store) >= container.storeCapacity){
            return;
        }
        
        var target = Game.getObjectById(creep.memory.energySourceId);
        var result = creep.harvest(target);
        if (result == OK) {
            creep.say("⛏️");
        } else if (result == ERR_NOT_IN_RANGE) {
            creep.say("ERR_NOT_IN_RANGE");
        } else if (result == ERR_TIRED) {
            creep.say("😴️⛏️");
        } else {
            creep.say(result);
        }
    }
};