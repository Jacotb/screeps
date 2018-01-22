var move = require('move');

module.exports = {
    run: function(creep){
        if (creep.memory.harvesting === undefined) {
            creep.memory.harvesting = true;
        }
        
        if (creep.memory.harvesting) {
            if (creep.carry.energy < creep.carryCapacity) {
                if (creep.memory.energySourceId == undefined) {
                    creep.memory.energyTargetId = undefined;
                    var source = _.sample(creep.room.find(FIND_SOURCES));
                    creep.memory.energySourceId = source.id;
                }
                var energySource = Game.getObjectById(creep.memory.energySourceId);
                var result = creep.harvest(energySource);
                if (result == OK) {
                    creep.say("⛏️");
                } else if (result == ERR_NOT_IN_RANGE) {
                    move.run(creep, energySource, '#ff0000', '️⛏️');
                } else if (result == ERR_TIRED) {
                    creep.say("😴️⛏️");
                } else {
                    creep.say(result);
                }
            } else {
                creep.memory.harvesting = false;
            }
        } else {
            if (creep.carry.energy > 0) {
                if (creep.memory.energyTargetId == undefined) {
                    //creep.memory.energySourceId = undefined;
                    var target = _.sample(creep.room.find(FIND_STRUCTURES).filter(function(structure){
    	                return structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity;
                    }));
                    if (target === undefined) {
                        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: function(structure) {
                	        return structure.energy < structure.energyCapacity
                	    }});
                    }
                    if (target === null) {
                        result = creep.upgradeController(creep.room.controller)
                	    if(result == OK) {	       
                            creep.say("⬆️");
                	    } else if(result == ERR_NOT_IN_RANGE) {
                            move.run(creep, creep.room.controller, '#0000ff', '⬆️');
                        } else if (result == ERR_TIRED) {
                            creep.say("😴⬆️");
                        } else {
                            creep.say(result)
                        }
                        return true
                    } else {
                        creep.memory.energyTargetId = target.id;
                    }
                }
                var energyTarget = Game.getObjectById(creep.memory.energyTargetId);
                if (energyTarget.energy >= energyTarget.energyCapacity) {
                    creep.memory.energyTargetId = undefined;
                } else {
                    var result = creep.transfer(energyTarget, RESOURCE_ENERGY);
                    if (result == OK) {
        	            creep.say("🎁");
                    } else if (result == ERR_NOT_IN_RANGE) {
                        move.run(creep, energyTarget, '#aa0000', '🎁️');
                    } else if (result == ERR_FULL) {
                        creep.memory.energyTargetId = undefined;
                    }  else if (result == ERR_TIRED) {
                        creep.say("😴🎁");
                    } else {
                        creep.say(result);
                    }
                }
            } else {
                creep.memory.harvesting = true;
            }
        }
    }
};