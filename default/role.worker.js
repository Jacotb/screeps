var utilMove = require('util.move');
var utilPosition = require('util.position');

module.exports = {
    Task: Object.freeze({build: 1, upgrade: 2, repair: 3, transfer: 4, harvest: 5, pickup: 6, withdraw: 7}),
    ANTICIPATE_SOURCE_REGENERATION_DURATION: 24,

    run: function(creep) {
        var taskOngoing = false;
        var iterations = 0;
        while (!taskOngoing) {
            iterations++;
            switch(creep.memory.task){
                case this.Task.build:
                    taskOngoing = this.build(creep);
                    break;
                case this.Task.upgrade:
                    taskOngoing = this.upgrade(creep);
                    break;
                case this.Task.repair:
                    taskOngoing = this.repair(creep);
                    break;
                case this.Task.transfer:
                    taskOngoing = this.transfer(creep);
                    break;
                case this.Task.withdraw:
                    taskOngoing = this.withdraw(creep);
                    break;
                case this.Task.harvest:
                    taskOngoing = this.harvest(creep);
                    break; 
                case this.Task.pickup:
                    taskOngoing = this.pickup(creep);
                    break;
                default:
                    break;
            }
            
            if (!taskOngoing) {
                creep.memory.task = this.findTask(creep);
                this.resetTaskMemory(creep);
            }
            
            if (iterations > 10){
                creep.say('no task');
                break;
            }
        }
    },
    
    resetTaskMemory: function(creep) {
        delete creep.memory.buildTargetId;
        delete creep.memory.upgradeTargetId;
        delete creep.memory.repairTargetId;
        delete creep.memory.transferTargetId;
        delete creep.memory.harvestTargetId;
        delete creep.memory.harvestSourceRegenerationRetargeted;
        delete creep.memory.withdrawTargetId;
        delete creep.memory.pickupTargetId;
    },
    
    findTask: function(creep) {
        var potentialTasks = [];
        var self = this;
               
	    if(creep.carry.energy == 0) {
	        if (_.some(creep.room.find(FIND_DROPPED_RESOURCES), function(resource){
	            return resource.resourceType == RESOURCE_ENERGY;
	        })) {
	            potentialTasks.push(self.Task.pickup);
	        }
	        
	        if (_.some(creep.room.find(FIND_SOURCES), function(source){
	            return (_.size(utilPosition.getSourceMiners(source)) + _.size(_.filter(Game.creeps, function(creep){
	                return creep.memory.task == self.Task.harvest && creep.memory.harvestTargetId == source.id;
	            })) < _.size(utilPosition.getSourceMiningSpots(source)));
	        })) {
	            potentialTasks.push(self.Task.harvest);
	        }
	        
	        if (_.some(utilPosition.getMiningContainers(creep.room), function(container){
	           return container.store[RESOURCE_ENERGY] >= creep.carryCapacity;
	        })) {
	            potentialTasks.push(self.Task.withdraw);
	            potentialTasks.push(self.Task.withdraw);
	            potentialTasks.push(self.Task.withdraw);
	        }
	    } else {
	        if (Math.random() < 0.2){
	            potentialTasks.push(self.Task.upgrade);
	        }
	            
	        if (_.some(creep.room.find(FIND_MY_STRUCTURES), function(structure){
	            return structure.energy < structure.energyCapacity && !_.some(_.filter(Game.creeps, function(gCreep){
    	            return gCreep.memory.role == "worker" && gCreep.memory.task == self.Task.transfer && gCreep.memory.transferTargetId == structure.id && (structure.energyCapacity - structure.energy) <= gCreep.carry.energy;
    	        }));
	        })) {
	            potentialTasks.push(self.Task.transfer);
	        }
	        
	        if (!_.some(potentialTasks, function(task){
	            return task == self.Task.transfer;
	        })) {
    	        if (_.some(creep.room.find(FIND_STRUCTURES), function(structure){
        	        return structure.hits < structure.hitsMax / 1.33;
    	        })) {
    	            potentialTasks.push(self.Task.repair);
    	        }
    	        
    	        if (_.some(creep.room.find(FIND_MY_CONSTRUCTION_SITES))) {
    	            potentialTasks.push(self.Task.build);
	            }
	        }
	    }
	    
	    return _.sample(potentialTasks);
    },
	
	build: function(creep) {
	    var target;
	    if (creep.memory.buildTargetId === undefined){
	        target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
    	    if (target) {
    	        creep.memory.buildTargetId = target.id;
    	    } else {
    	        return false;
    	    }
	    } else {
    	    target = Game.getObjectById(creep.memory.buildTargetId);
    	    if (!target) {
    	        return false;
    	    }
	    }
	    
	    if (creep.carry.energy <= 0) {
	        return false;
	    }
    	    
        var result = creep.build(target)
        if(result == OK) {
            creep.say("🏗️");
        } else if(result == ERR_NOT_IN_RANGE) {
            utilMove.run(creep, target, '#0000ff', '🏗️');
        } else if (result == ERR_INVALID_TARGET){
            creep.room.lookForAt(LOOK_CREEPS, target.pos.x, target.pos.y).forEach(function(blocker){
                blocker.move(_.sample([TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT]))
            });
        } else if (result == ERR_TIRED) {
            creep.say("😴🏗️");
        } else {
            creep.say(result);
        }
        return true;
	},
	
	upgrade: function(creep) {
	    var target;
	    if (creep.memory.upgradeTargetId === undefined){
	        target = creep.room.controller;
    	    if (target) {
    	        creep.memory.upgradeTargetId = target.id;
    	    } else {
    	        return false;
    	    }
	    } else {
    	    target = Game.getObjectById(creep.memory.upgradeTargetId);
    	    if (!target) {
    	        return false;
    	    }
	    }
	    
	    if (creep.carry.energy <= 0) {
	        return false;
	    }
        
	    var result = creep.upgradeController(target);
	    if(result == OK) {
            creep.say("⬆️");
	    } else if(result == ERR_NOT_IN_RANGE) {
            utilMove.run(creep, target, '#0000ff', '⬆️');
        } else if (result == ERR_TIRED) {
            creep.say("😴⬆️");
        } else {
            creep.say(result)
        }	       
        return true;
	},
	
	repair: function(creep) {
	    var target;
	    if (creep.memory.repairTargetId === undefined) {
    	    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: function(structure) {
    	        return structure.hits < structure.hitsMax / 1.33;
    	    }});
    	    if (target) {
    	        creep.memory.repairTargetId = target.id;
    	    } else {
    	        return false;
    	    }
	    } else {
    	    target = Game.getObjectById(creep.memory.repairTargetId);
    	    if (!target) {
    	        return false;
    	    }
	    }
	    
	    if (creep.carry.energy <= 0) {
	        return false;
	    }
	    
        if (target.hits >= target.hitsMax){
            return false;
        } 
        
        var result = creep.repair(target)
        if(result == OK) {
            creep.say("🔧");
        } else if(result == ERR_NOT_IN_RANGE) {
            utilMove.run(creep, target, '#00ff00', '🔧');
        } else if (result == ERR_TIRED) {
            creep.say("😴🔧");
        } else if (result == ERR_INVALID_TARGET) {
            return false;
        } else {
            creep.say(result);
        }
        return true;
	},
	
	transfer: function(creep) {
	    var target;
	    var self = this;
	    if (creep.memory.transferTargetId === undefined) {
    	    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: function(structure) {
    	        return structure.energy < structure.energyCapacity && !_.some(_.filter(Game.creeps, function(gCreep){
    	            return gCreep.memory.role == "worker" && gCreep.memory.task == self.Task.transfer && gCreep.memory.transferTargetId == structure.id && (structure.energyCapacity - structure.energy) <= gCreep.carry.energy;
    	        }));
    	    }});
    	    if (target) {
    	        creep.memory.transferTargetId = target.id;
    	    } else {
    	        return false;
    	    }
	    } else {
    	    target = Game.getObjectById(creep.memory.transferTargetId);
    	    if (!target) {
    	        return false;
    	    }
	    }
	    
	    if (creep.carry.energy <= 0) {
	        return false;
	    }
	    
	    if (target.energy >= target.energyCapacity) {
	        return false;
	    }
	    
        var result = creep.transfer(target, RESOURCE_ENERGY, Math.min(target.energyCapacity - target.energy, creep.carry.energy))
        if(result == OK) {
            creep.say("🎁");
        } else if(result == ERR_NOT_IN_RANGE) {
            utilMove.run(creep, target, '#aa0000', '🎁');
        } else if (result == ERR_TIRED) {
            creep.say("😴🎁");
        } else {
            creep.say(result)
        }
        return true;
	},
	
	harvest: function(creep){
	    var target;
	    
	    var retarget = false;
	    if (creep.memory.harvestTargetId === undefined){
	        retarget = true;
	    }
	    if (!retarget && creep.memory.harvestSourceRegenerationRetargeted === undefined &&
	            (_.some(creep.room.find(FIND_SOURCES), function (source){
        	        return source.ticksToRegeneration < this.ANTICIPATE_SOURCE_REGENERATION_DURATION;
        	    }) || _.some(creep.room.find(FIND_SOURCES), function (source){
        	        return source.energy == source.energyCapacity;
        	    }))
        	){
        	    creep.memory.harvestSourceRegenerationRetargeted = true;
        	    retarget = true;
        }
        
        if (retarget) {
    	    target = this.findLeastUtilizedSource(creep);
    	    if (target) {
    	        creep.memory.harvestTargetId = target.id;
    	    } else {
    	        return false;
    	    }
	    } else {
    	    target = Game.getObjectById(creep.memory.harvestTargetId);
    	    if (!target) {
    	        return false;
    	    }
	    }
	    
	    if (creep.carry.energy >= creep.carryCapacity) {
	        return false;
	    }
	    
        var result = creep.harvest(target);
        if (result == OK) {
            creep.say("⛏️");
        } else if (result == ERR_NOT_IN_RANGE) {
            return utilMove.run(creep, target, '#ff0000', '️⛏️');
        } else if (result == ERR_TIRED) {
            creep.say("😴️⛏️");
        } else if (result == ERR_NOT_ENOUGH_RESOURCES){
            if (target.ticksToRegeneration < this.ANTICIPATE_SOURCE_REGENERATION_DURATION){
                utilMove.run(creep, target, '#ff0000', '️⛏️');
            } else {
                return false;
            }
        }  else {
            creep.say(result);
        }
        return true;
	},
	
	withdraw: function(creep) {
	    var target;
	    if (creep.memory.withdrawTargetId === undefined) {
	        target = creep.pos.findClosestByPath( _.filter(utilPosition.getMiningContainers(creep.room), function(container){
	            return container.store[RESOURCE_ENERGY] >= creep.carryCapacity;
	        }));
    	    if (target) {
    	        creep.memory.withdrawTargetId = target.id;
    	    } else {
    	        return false;
    	    }
	    } else {
    	    target = Game.getObjectById(creep.memory.withdrawTargetId);
    	    if (!target) {
    	        return false;
    	    }
	    }
	    
	    if (creep.carry.energy >= creep.carryCapacity) {
	        return false;
	    }
	    
        var result = creep.withdraw(target, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy);
        if (result == OK) {
            creep.say('⛽');
        } else if (result == ERR_NOT_IN_RANGE) {
            utilMove.run(creep, target, '#ff0000', '⛽');
        } else if (result == ERR_TIRED) {
            creep.say("😴⛽");
        } else if (result == ERR_NOT_ENOUGH_RESOURCES){
            return false;
        } else {
            creep.say(result);
        }
        return true;
	},
	
	pickup: function(creep) {
	    var target;
	    if (creep.memory.pickupTargetId === undefined){
	        target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: function(resource){
    	            return resource.resourceType == RESOURCE_ENERGY;
    	        }});
    	    if (target) {
    	        creep.memory.pickupTargetId = target.id;
    	    } else {
    	        return false;
    	    }
	    } else {
    	    target = Game.getObjectById(creep.memory.pickupTargetId);
    	    if (!target) {
    	        return false;
    	    }
	    }
	    
	    if (creep.carry.energy >= creep.carryCapacity) {
	        return false;
	    }
	    
        var result = creep.pickup(target);
        if(result == OK) {
            creep.say("🚜");
        } else if (result == ERR_NOT_IN_RANGE) {
            utilMove.run(creep, target, '#ff0000', '🚜');
        } else if (result == ERR_TIRED) {
            creep.say("😴🚜");
        } else {
            creep.say(result)
        }
        return true;
	},
	
	findLeastUtilizedSource: function(creep) {
	    var self = this;
	    return _.first(_.sortBy(_.filter(creep.room.find(FIND_SOURCES), function(source){
	        return source.energy > 0 || source.ticksToRegeneration < this.ANTICIPATE_SOURCE_REGENERATION_DURATION;
	    }), 
	    function(source) {
	        var nSpots = _.size(utilPosition.getSourceMiningSpots(source));
	        
	        var nCreeps = _.size(_.filter(Game.creeps, function(gCreep){
	            return gCreep.memory.task == self.Task.harvest && gCreep.memory.harvestTargetId == source.id;
	        })) + _.size(utilPosition.getSourceMiners(source));
	        
	        return nCreeps / (nSpots + 1);
	    }));
	}
};