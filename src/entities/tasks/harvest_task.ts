import {Task} from "./task";
import {RoomStatic} from "../static/room_static";
import {CreepStatic} from "../static/creep_static";
import {MineTask} from "./mine_task";

export class HarvestTask extends Task {
    public constructor(public source: Source, public spot: RoomPosition) {
        super();
    }

    public serialize() {
        return {type: (this.constructor as any).name, source: this.source.id, spot: this.spot}
    }

    public static deserialize(data: any) {
        return new HarvestTask(Game.getObjectById(data.source) as Source, new RoomPosition(data.spot.x, data.spot.y, data.spot.roomName));
    }

    public bodyParts() {
        return [MOVE, WORK, CARRY];
    }

    public eligibleCreeps() {
        return super.eligibleCreeps().filter(creep => {
            return creep.carry.energy == 0;
        });
    }

    public run(creep: Creep) {
        if (creep.carry.energy >= creep.carryCapacity) {
            creep.removeTask();
            return;
        }

        switch (creep.harvest(this.source)) {
            case OK:
            case ERR_TIRED:
                break;
            case ERR_NOT_IN_RANGE:
                switch (creep.moveTo(this.source)) {
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
                break;
            case ERR_NOT_OWNER:
            case ERR_BUSY:
            case ERR_INVALID_TARGET:
            case ERR_NO_BODYPART:
            case ERR_NOT_FOUND:
            case ERR_NOT_ENOUGH_RESOURCES:
                creep.say('quit');
                creep.removeTask();
                break;
        }
    }

    public startPoint() {
        return this.source.pos;
    }

    public static findAll(): HarvestTask[] {
        return RoomStatic.visibleRooms()
            .flatMap(room => room.getSources())
            .filter(source => {
                return _.all(source.getHarvestSpots(), spot => {
                    return !spot.isBlocked() && !spot.isOccupied()
                        && !_.some(CreepStatic.getAll().filter(creep => {
                            const task = creep.getTask();
                            if (!task || !(task instanceof HarvestTask)) {
                                return false;
                            }

                            return task.source.id == source.id && task.spot.isEqualTo(spot);
                        }));
                });
            })
            .map(source => new HarvestTask(source, _.sample(_.filter(source.getHarvestSpots(), spot => !spot.isBlocked() && !spot.isOccupied()
                && !_.some(CreepStatic.getAll().filter(creep => {
                    const task = creep.getTask();
                    if (!task || (!(task instanceof HarvestTask) && !(task instanceof MineTask))) {
                        return false;
                    }

                    return task.source == source && task.spot == spot;
                }))
            ))));
    }

    public toString = (): string => {
        return `${(this.constructor as any).name}(${this.spot})`;
    }
}