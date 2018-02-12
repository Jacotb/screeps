import 'typescript-array-extensions';
import {RoomStatic} from "./static/room_static";

export class Builder {
    static run(): void {
        if (!this.spawnPlaced()) {
            this.placeSpawn();
            return;
        }

        if (this.hasSpawn()) {
        }
    }

    static hasSpawn(): boolean {
        return _.some(Game.spawns);
    }

    static getSpawn(): StructureSpawn {
        return _.sample(Game.spawns);
    }

    static spawnPlaced(): boolean {
        return _.some(Game.spawns) || _.some(RoomStatic.visibleRooms().flatMap(room => {
            return room.find(FIND_CONSTRUCTION_SITES, {
                filter: (site: ConstructionSite) => {
                    return site.structureType == STRUCTURE_SPAWN;
                }
            });
        }));
    }

    static placeSpawn() {
        const spot = this.findSpawnPosition();
        Game.rooms[spot.roomName].createConstructionSite(spot, STRUCTURE_SPAWN);
    }

    static findSpawnPosition(): RoomPosition {
        const spawnRoom = this.findSpawnRoom();
        const sources = spawnRoom.getSources();
        const centerX = Math.round(sources.average(source => source.pos.x));
        const centerY = Math.round(sources.average(source => source.pos.y));
        let radius = 0;

        let found = false;
        let spot = null;
        while (!found) {
            let top = Math.max(0, centerY - radius);
            let left = Math.max(0, centerX - radius);
            let bottom = Math.min(49, centerY + radius);
            let right = Math.min(49, centerX + radius);

            let spots = _.filter(spawnRoom.lookForAtArea<"terrain">("terrain", top, left, bottom, right, true),
                spot => {
                    return spot.terrain == "plain";
                });
            if (_.some(spots)) {
                spot = _.sample(spots);
                found = true;
            }

            if (radius >= 50) {
                throw new Error('No plain spot found to spawn on');
            }
        }

        if (spot == null) {
            throw new Error('Spot is null (this cannot happen)');
        }

        return new RoomPosition(spot.x, spot.y, spawnRoom.name);
    }

    static findSpawnRoom(): Room {
        let availableRoomNames = RoomStatic.availableRoomNames();
        if (_.some(availableRoomNames) && Game.rooms[_.first(availableRoomNames)]) {
            return Game.rooms[_.first(availableRoomNames)];
        } else if (_.some(RoomStatic.visibleRooms())) {
            return _.first(RoomStatic.visibleRooms());
        } else {
            throw new Error('No spawnable room');
        }
    }
}