interface StructureSpawn {
    buildSupplyLines(visibleRooms: Room[]): void;

    run(): void;
}

StructureSpawn.prototype.run = function () {
    if (Game.time % 100 == 0) {
        this.buildSupplyLines(_.values<Room>(Game.rooms));
    }
};

StructureSpawn.prototype.buildSupplyLines = function (visibleRooms: Room[]) {
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

            room.createConstructionSite(path[path.length - 2].x, path[path.length - 2].y, STRUCTURE_CONTAINER);

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
