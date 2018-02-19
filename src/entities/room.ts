import {Collection} from "../utils/collection";
import range = Collection.range;

Room.prototype.getAllSpots = function () {
    return _.flatten(range(0, 49).map(x => {
        return range(0, 49).map(y => {
            return this.getPositionAt(x, y);
        });
    }));
};

Room.prototype.getSources = function () {
    return this.find(FIND_SOURCES);
};

Room.prototype.planRoadCostMatrix = function () {
    const costMatrix = new PathFinder.CostMatrix();
    this.lookForAtArea("terrain", 0, 0, 49, 49, true)
        .forEach((spot: { terrain: Terrain, x: number, y: number }) => {
            if (spot.terrain == "plain" || spot.terrain == "swamp") {
                if (_.some(this.lookForAt(LOOK_STRUCTURES, spot.x, spot.y), (structure: Structure) => {
                        return structure.isBlocker();
                    })) {
                    costMatrix.set(spot.x, spot.y, Infinity);
                } else {
                    costMatrix.set(spot.x, spot.y, 1);
                }
            } else {
                costMatrix.set(spot.x, spot.y, Infinity);
            }
        });
    return costMatrix;
};

Room.prototype.getOwnStructures = function () {
    return this.find(FIND_STRUCTURES).filter((structure: Structure) => {
        return ((structure.isOwned() && structure.my) || !structure.isOwned());
    });
};

Room.prototype.getOwnEnergyStructures = function () {
    return this.getOwnStructures().filter((structure: Structure) => {
        return structure.structureType == STRUCTURE_STORAGE
            || structure.structureType == STRUCTURE_EXTENSION
            || structure.structureType == STRUCTURE_TOWER
            || structure.structureType == STRUCTURE_SPAWN;
    });
};

Room.prototype.getContainers = function () {
    return this.find(FIND_STRUCTURES).filter((structure: Structure) => {
        return structure.structureType == STRUCTURE_CONTAINER;
    });
};

Room.prototype.getExtensions = function () {
    return this.find(FIND_STRUCTURES).filter((structure: Structure) => {
        return structure.structureType == STRUCTURE_EXTENSION;
    });
};

Room.prototype.getTowers = function () {
    return this.find(FIND_MY_STRUCTURES).filter((structure: Structure) => {
        return structure.structureType == STRUCTURE_TOWER;
    });
};

Room.prototype.findExtensionSpot = function (closeTo: RoomPosition) {
    return _.first((<RoomPosition[]>this.getAllSpots()).filter(spot => {
        return spot.x >= 2 && spot.x <= 47 && spot.y >= 2 && spot.y <= 47
            && !spot.isBlocked() && !spot.hasRoad() && !spot.hasConstructionSite() && _.all(spot.getStraightNeighbours(), neighbour => {
                return !neighbour.isBlocked() && !neighbour.hasRoad() && !neighbour.hasConstructionSite() && _.all(neighbour.getStraightNeighbours(), neighboursNeighbour => {
                    return !neighboursNeighbour.isBlocked() && (!neighboursNeighbour.hasConstructionSite() || neighboursNeighbour.hasRoadConstructionSite());
                });
            });
    }).sort((spotA, spotB) => {
        return closeTo.getMultiRoomRangeTo(spotA) - closeTo.getMultiRoomRangeTo(spotB);
    }));
};

Room.prototype.getOwnConstructionSites = function () {
    return this.find(FIND_MY_CONSTRUCTION_SITES);
};