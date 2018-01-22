var roleHarvester = require('role.harvester');
var move = require('move');

module.exports = {

    run: function(creep) {
        if (creep.memory.building === undefined) {
            creep.memory.building = false;
        }
        
	    if(creep.carry.energy > 0) {
	        if (creep.memory.building) {
	            if (creep.memory.upgrading) {
    	            this.upgrade(creep);
	            } else {
        	        this.repair(creep) ||
        	        this.build(creep) ||
        	        this.transfer(creep) ||
        	        this.upgrade(creep)
	            }
	        }
	    } else {
	        if (creep.memory.building) {
	            creep.memory.building = false;
	        }
	    }
	    
	    if(creep.carry.energy < creep.carryCapacity) {
	        if (!creep.memory.building) {
    	        target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: function(resource){
    	            return resource.resourceType == RESOURCE_ENERGY;
    	        }})
                if(target) {
                    result = creep.pickup(target)
                    if(result == OK) {
                        return
                    } else if (result == ERR_NOT_IN_RANGE) {
                        move.run(creep, target, '#ff0000', '🚜');
                    } else if (result == ERR_TIRED) {
                        creep.say("😴🚜");
                    } else {
                        creep.say(result)
                    }
                } else {
                    roleHarvester.run(creep);
                }
	        }
	    } else {
	        if (creep.memory.building == false) {
	            creep.memory.upgrading = (Math.random() < 0.1);
	            creep.memory.building = true;
	        }
	    }
	},
	
	transfer: function(creep) {
	    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: function(structure) {
	        return structure.energy < structure.energyCapacity
	    }})
	    if(!target) {
	        return false
	    } else {
	        result = creep.transfer(target, RESOURCE_ENERGY, Math.min(target.energyCapacity - target.energy, creep.carry.energy))
	        if(result == OK) {
	            
	        } else if(result == ERR_NOT_IN_RANGE) {
                move.run(creep, target, '#aa0000', '🎁');
	        } else if (result == ERR_TIRED) {
                creep.say("😴🎁");
            } else {
	            creep.say(result)
	        }
	        creep.say("🎁");
	        return true
	    }
	},
	
	repair: function(creep) {
	    if (creep.memory.repairTargetId === undefined) {
    	    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: function(structure) {
    	        return structure.hits < structure.hitsMax / 1.33;
    	    }});
    	    if (target) {
    	        creep.memory.repairTargetId = target.id;
    	    }
	    }
	    if(!creep.memory.repairTargetId) {
	        return false;
	    } else {
	        var target = Game.getObjectById(creep.memory.repairTargetId);
	        if (target === null || target.hits >= target.hitsMax){
	            creep.memory.repairTargetId = undefined;
	        } else {
    	        result = creep.repair(target)
    	        if(result == OK) {
    	            creep.say("🔧");
    	        } else if(result == ERR_NOT_IN_RANGE) {
                    move.run(creep, target, '#00ff00', '🔧');
    	        } else if (result == ERR_TIRED) {
                    creep.say("😴🔧");
                } else if (result == ERR_INVALID_TARGET) {
                    console.log("invalid repair target: ", target);
	                creep.memory.repairTargetId = undefined;
                } else {
    	            creep.say(result);
    	        }
	        }
	        return true;
	    }
	},
	
	upgrade: function(creep) {
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
	},
	
	build: function(creep) {
	    var target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {filter: function(consSite) {
	        return consSite.structureType == STRUCTURE_EXTENSION;
	    }});
	    if(!target){
	        var target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
    	    if(!target){
    	        return false
    	    } 
	    }
    	    
        result = creep.build(target)
        if(result == OK) {
            
        } else if(result == ERR_NOT_IN_RANGE) {
            move.run(creep, target, '#0000ff', '🏗️');
        } else if (result == ERR_INVALID_TARGET){
            creep.room.lookForAt(LOOK_CREEPS, target.pos.x, target.pos.y).forEach(function(blocker){
                blocker.move(_.sample([TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT]))
            })
        } else if (result == ERR_TIRED) {
            creep.say("😴🏗️");
        } else {
            creep.say(result)
        }
        creep.say("🏗️");
        return true
	}
};