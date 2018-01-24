var utilPosition = require('util.position');

module.exports = {
    tick: function(room){
        this.buildMiningContainers(room);
    },
    
    buildMiningContainers: function(room){
        if (room.memory.containerConstructionSitesCreated === undefined){
            if (_.every(utilPosition.getMiningSpots(room), function(minerSpot){
                if (_.every(minerSpot.lookFor(LOOK_CONSTRUCTION_SITES), function(consSite){
                    return consSite.structureType !== STRUCTURE_CONTAINER;
                }) && _.every(minerSpot.lookFor(LOOK_STRUCTURES), function(structure){
                    return structure.structureType !== STRUCTURE_CONTAINER;
                })){
                    return room.createConstructionSite(minerSpot, STRUCTURE_CONTAINER) === OK;
                } else {
                    return true;
                }
            })) {
                room.memory.containerConstructionSitesCreated = true;
            }
        }
    }
};