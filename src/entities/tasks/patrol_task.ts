import {Task} from "./task";
import {RoomStatic} from "../static/room_static";
import {CreepStatic} from "../static/creep_static";
import {BuildTask} from "./build_task";

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
        return [MOVE, ATTACK];
    }

    public run(creep: Creep) {
        if (this.since < Game.time - 189) {
            this.since = Game.time;

            this.spot = _.sample(_.sample(RoomStatic.visibleRooms()).getAllSpots().filter(spot => {
                return !spot.isBlocked() && !spot.isOccupied() && !spot.hasRoad() && !spot.hasConstructionSite()
            }));
        }

        if (!creep.pos.isEqualTo(this.spot)) {
            switch (creep.moveTo(this.spot)) {
                case OK:
                case ERR_TIRED:
                    break;
                case ERR_NOT_OWNER:
                case ERR_BUSY:
                case ERR_NO_BODYPART:
                case ERR_NO_PATH:
                case ERR_INVALID_TARGET:
                case ERR_NOT_FOUND:
                    creep.say('stop');
                    creep.removeTask();
                    break;
            }
        }
    }

    public startPoint() {
        return this.spot;
    }

    public static findAll(): PatrolTask[] {
        let tasks: PatrolTask[] = [];

        RoomStatic.visibleRooms().forEach(room => {
            for (let i = 0; i < 4; i++) {
                tasks.push(new PatrolTask(_.sample(room.getAllSpots()), -999));
            }
        });

        return _.take(tasks, _.size(tasks) - _.size(CreepStatic.findAllByTask((PatrolTask as any).name)));
    }

    public toString = (): string => {
        return `${(this.constructor as any).name}(${this.spot})`;
    }
}