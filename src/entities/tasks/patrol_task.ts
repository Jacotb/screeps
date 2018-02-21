import {Task} from "./task";
import {RoomStatic} from "../static/room_static";
import {CreepStatic} from "../static/creep_static";
import {BuildTask} from "./build_task";
import {Collection} from "../../utils/collection";
import range = Collection.range;

export class PatrolTask extends Task {
    public constructor(public spot: RoomPosition, public since: number) {
        super();
    }

    public serialize() {
        return {
            type: (this.constructor as any).name,
            spot: this.spot,
            since: this.since
        }
    }

    public static deserialize(data: any) {
        return new PatrolTask(new RoomPosition(data.spot.x, data.spot.y, data.spot.roomName), data.since);
    }

    public bodyParts(): BodyPartConstant[] {
        return _.sample([[MOVE, ATTACK], [MOVE, RANGED_ATTACK]]);
    }

    public run(creep: Creep) {
        if (this.since == 0 && this.spot.roomName == creep.pos.roomName){
            this.spot = PatrolTask.randomFreeSpotInRoom(this.spot.getRoom());
            this.since = Game.time;
        }

        if (!creep.pos.isEqualTo(this.spot)) {
            switch (creep.moveTo(this.spot)) {
                case OK:
                case ERR_TIRED:
                    break;
                case ERR_NOT_OWNER:
                case ERR_BUSY:
                case ERR_NO_BODYPART:
                case ERR_NOT_FOUND:
                    creep.say('stop');
                    creep.removeTask();
                    break;
                case ERR_NO_PATH:
                case ERR_INVALID_TARGET:
                    this.spot = PatrolTask.randomFreeSpotInRoom(this.spot.getRoom());
                    break;
            }
        }
    }

    private static randomSpot() {
        return new RoomPosition(_.sample(range(0, 49)), _.sample(range(0, 49)), _.sample(RoomStatic.domainRoomNames()));
    }

    private static randomSpotInRoomName(roomName: string) {
        return new RoomPosition(_.sample(range(0, 49)), _.sample(range(0, 49)), roomName);
    }

    private static randomFreeSpotInRoom(room: Room) {
        return _.sample(room.getAllSpots().filter(spot => {
            return !spot.isBlocked() && !spot.isOccupied() && !spot.hasRoad() && !spot.hasConstructionSite()
        }));
    }

    public startPoint() {
        return this.spot;
    }

    public static findAll(): PatrolTask[] {
        let tasks: PatrolTask[] = [];

        RoomStatic.domainRoomNames().forEach(roomName => {
            for (let i = 0; i < 4; i++) {
                tasks.push(new PatrolTask(this.randomSpotInRoomName(roomName), 0));
            }
        });

        return _.take(tasks, _.size(tasks) - _.size(CreepStatic.findAllByTask((PatrolTask as any).name)));
    }

    public toString = (): string => {
        return `${(this.constructor as any).name}(${this.spot})`;
    }
}