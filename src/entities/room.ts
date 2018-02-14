Room.prototype.getSources = function () {
    return this.find(FIND_SOURCES);
};

Room.prototype.planRoadCostMatrix = function (costMatrix: CostMatrix) {
    this.lookForAtArea("terrain", 0, 0, 49, 49, true)
        .forEach((spot: { terrain: Terrain, x: number, y: number }) => {
            if (spot.terrain == "plain" || spot.terrain == "swamp") {
                costMatrix.set(spot.x, spot.y, 1);
            }
        });
    return costMatrix;
};

Room.prototype.getOwnEnergyStructures = function () {
    return this.find(FIND_STRUCTURES).filter((structure: Structure) => {
        return ((structure.isOwned() && structure.my)
            || !structure.isOwned())
            && (
                structure.structureType == STRUCTURE_STORAGE
                || structure.structureType == STRUCTURE_EXTENSION
                || structure.structureType == STRUCTURE_TOWER
                || structure.structureType == STRUCTURE_SPAWN
            )

    });
};