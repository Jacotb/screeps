import {RoomStatic} from "./static/room_static";

export class Tower {
    public static run() {
        _.flatten(RoomStatic.visibleRooms().map(room => {
            return room.getTowers();
        })).forEach((tower) => {
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
            const damagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function (creep) {
                    return creep.hits < creep.hitsMax;
                }
            });
            if (damagedCreep) {
                tower.heal(damagedCreep);
            }
            const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function (structure) {
                    return structure.hits < structure.hitsMax;
                }
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        })
    }
}