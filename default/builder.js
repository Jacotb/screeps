var utilPosition = require('util.position');

module.exports = {
    tick: function (room) {
        this.buildMiningContainers(room);
    },

    buildMiningContainers: function (room) {
        if (Math.random() < 0.05) {
            _.forEach(utilPosition.getMiningSpots(room), function (minerSpot) {
                if (_.every(minerSpot.lookFor(LOOK_CONSTRUCTION_SITES), function (consSite) {
                        return consSite.structureType !== STRUCTURE_CONTAINER;
                    }) && _.every(minerSpot.lookFor(LOOK_STRUCTURES), function (structure) {
                        return structure.structureType !== STRUCTURE_CONTAINER;
                    })) {
                    room.createConstructionSite(minerSpot, STRUCTURE_CONTAINER);
                }
            })
        }
    }
};
