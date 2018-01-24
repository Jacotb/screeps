module.exports = {
	neighbours: function(pos) {
	    var room = Game.rooms[pos.roomName];
	    var positions = [];
	    for (var x = -1; x <= 1; x++){
	        for (var y = -1; y <= 1; y++){
	            if (x != 0 || y != 0) {
	                var neighbour = room.getPositionAt(pos.x + x, pos.y + y);
	                if (neighbour != null){
	                    positions.push(neighbour);
	                }
	            }
	        }
	    }
	    return positions;
	},
	
	getSourceMiningSpots: function(source) {
        return _.filter(this.neighbours(source.pos), function(neighbour) {
            return neighbour.lookFor(LOOK_TERRAIN) != 'wall';
        });
	},
	
	getSourceMiningContainers: function(source) {
        return _.filter(_.map(this.getSourceMiningSpots(source), function(miningSpot){
            return _.find(miningSpot.lookFor(LOOK_STRUCTURES), function(structure){
                return structure.structureType == STRUCTURE_CONTAINER;
            });
        }), function(container) {
            return container !== undefined;
        });
	},
	
	getSourceMiners: function(source) {
	    return _.filter(Game.creeps, function(gCreep){
            return gCreep.memory.role == 'miner' && gCreep.memory.energySourceId == source.id;
        });
	},
    
    getMiningSpots: function(room){
        var self = this;
        if (room.memory.minerSpots === undefined){
            room.memory.minerSpots = _.map([].concat.apply([], _.map(room.find(FIND_SOURCES), function(source) {
    	        return _.filter(self.neighbours(source.pos), function(neighbour) {
    	            return neighbour.lookFor(LOOK_TERRAIN) != 'wall';
    	        });
            })), function(pos) {
                return {x: pos.x, y: pos.y};
            });
        }
        
        return _.map(room.memory.minerSpots, function(spot){
            return room.getPositionAt(spot.x, spot.y);
        });
    },
    
    getMiningContainers: function(room){
        return _.filter(_.map(this.getMiningSpots(room), function(miningSpot){
            return _.find(miningSpot.lookFor(LOOK_STRUCTURES), function(structure){
                return structure.structureType == STRUCTURE_CONTAINER;
            });
        }), function(container) {
            return container !== undefined;
        });
    },
    
    getFreeMiningContainer: function(room){
        return _.find(this.getMiningContainers(room), function(container){
            return !_.some(Game.creeps, function(creep){
                return creep.memory.role == 'miner' && creep.memory.miningContainerId == container.id;
            });
        });
    }
};