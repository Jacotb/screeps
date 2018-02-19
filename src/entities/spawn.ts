import {TaskMaster} from "./task_master";
import {CreepStatic} from "./static/creep_static";
import {RoomStatic} from "./static/room_static";

StructureSpawn.prototype.run = function () {
    if (Game.time % 100 == 0) {
        this.buildSupplyLines(_.values<Room>(Game.rooms));
        this.buildControllerSupplyLines(_.values<Room>(Game.rooms));
        this.buildExtensions();
    }

    if (_.size(CreepStatic.getAll()) < 20 * _.size(RoomStatic.visibleRooms())) {
        this.spawnCreepForTask(TaskMaster.getCreepLessTask(this.pos));
    }
};

StructureSpawn.prototype.buildSupplyLines = function (visibleRooms) {
    visibleRooms.forEach(room => {
        room.getSources().forEach(source => {
            const path = room.findPath(this.pos, source.pos, {
                ignoreCreeps: true,
                costCallback: (roomName, costMatrix) => {
                    const room = Game.rooms[roomName];
                    if (!room) {
                        return costMatrix;
                    }
                    return room.planRoadCostMatrix(costMatrix);
                }
            });

            if(path.length >= 2) {
                room.createConstructionSite(path[path.length - 2].x, path[path.length - 2].y, STRUCTURE_CONTAINER);
            }

            path.forEach(spot => {
                if (!_.some(room.lookForAt("structure", spot.x, spot.y), structure => {
                        return structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER;
                    })) {
                    room.createConstructionSite(spot.x, spot.y, STRUCTURE_ROAD);
                }
            });
        })
    });
};

StructureSpawn.prototype.buildControllerSupplyLines = function (visibleRooms) {
    this.pos.getNeighbours().forEach(spot => {
        this.room.createConstructionSite(spot, STRUCTURE_ROAD);
    });

    visibleRooms.filter(room => {
        return room.controller && room.controller.my;
    }).forEach(room => {
        const path = room.findPath(this.pos, (<StructureController>room.controller).pos, {
            ignoreCreeps: true,
            costCallback: (roomName, costMatrix) => {
                const room = Game.rooms[roomName];
                if (!room) {
                    return costMatrix;
                }
                return room.planRoadCostMatrix(costMatrix);
            }
        });

        path.forEach(spot => {
            if (!_.some(room.lookForAt("structure", spot.x, spot.y), structure => {
                    return structure.structureType == STRUCTURE_ROAD;
                })) {
                room.createConstructionSite(spot.x, spot.y, STRUCTURE_ROAD);
            }
        });
    });
};

StructureSpawn.prototype.buildExtensions = function () {
    if (_.size(this.room.getExtensions())
        + _.size(this.room.getOwnConstructionSites().filter(site => site.structureType == STRUCTURE_EXTENSION))
        <= CONTROLLER_STRUCTURES["extension"][(<StructureController>this.room.controller).level] - 5) {
        const spot = this.room.findExtensionSpot(this.pos);
        if (spot) {
            this.room.createConstructionSite(spot, STRUCTURE_EXTENSION);
            spot.getStraightNeighbours().forEach(neighbour => {
                this.room.createConstructionSite(neighbour, STRUCTURE_EXTENSION);
            });
            this.room.createConstructionSite(spot.x, spot.y - 2, STRUCTURE_ROAD);
            this.room.createConstructionSite(spot.x + 1, spot.y - 1, STRUCTURE_ROAD);
            this.room.createConstructionSite(spot.x + 2, spot.y, STRUCTURE_ROAD);
            this.room.createConstructionSite(spot.x + 1, spot.y + 1, STRUCTURE_ROAD);
            this.room.createConstructionSite(spot.x, spot.y + 2, STRUCTURE_ROAD);
            this.room.createConstructionSite(spot.x - 1, spot.y + 1, STRUCTURE_ROAD);
            this.room.createConstructionSite(spot.x - 2, spot.y, STRUCTURE_ROAD);
            this.room.createConstructionSite(spot.x - 1, spot.y - 1, STRUCTURE_ROAD);
        }
    }

};

StructureSpawn.prototype.spawnCreepForTask = function (task) {
    if (!this.memory.creepSize){
        this.memory.creepSize = 1;
    }

    if (!this.spawning){
        const spawnResult = this.spawnCreep(this.createBody(task.bodyParts(), this.room.energyCapacityAvailable * this.memory.creepSize), `${this.name}-${Game.time}`);
        switch(spawnResult) {
            case OK:
                this.memory.creepSize = 1;
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                this.memory.creepSize = this.memory.creepSize * 0.99;
                console.log('creepSize', this.memory.creepSize);
                break;
            default:
                break;
        }
    }

};

StructureSpawn.prototype.createBody = function (component, maxSize) {
    let body = component;
    let testBody = body;
    while (this.bodyCost(testBody) <= maxSize) {
        body = testBody;
        testBody = testBody.concat(component);
    }
    return body;
};


StructureSpawn.prototype.bodyCost = function (body) {
    return body.reduce(function (cost, part) {
        return cost + BODYPART_COST[part];
    }, 0);
}