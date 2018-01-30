module.exports = {

    /** @param {Room} room **/
    tick: function (room) {
        towers = room.find(FIND_MY_STRUCTURES, {
            filter: {structureType: STRUCTURE_TOWER}
        });
        _.forEach(towers, function (tower) {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
            var damagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function (creep) {
                    return creep.hits < creep.hitsMax;
                }
            });
            if (damagedCreep) {
                tower.heal(damagedCreep);
            }
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function (structure) {
                    return structure.hits < structure.hitsMax;
                }
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        })
    }
};