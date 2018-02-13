import {Task} from "./task";
import {RoomStatic} from "../static/room_static";
import {CreepStatic} from "../static/creep_static";

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

    public bodyParts(): BodyPartConstant[] {
        return [MOVE, WORK, CARRY];
    }

    public run(creep: Creep) {
        if (creep.carry.energy >= creep.carryCapacity) {
            creep.removeTask();
            return;
        }

        const success = creep.harvest(this.source);
        if (success !== OK) {
            console.log(this.spot);
            const move = creep.moveTo(this.spot);
            if (move !== OK) {
                creep.say(move + "");

            }
        }
    }

    public static findAll(): HarvestTask[] {
        return RoomStatic.visibleRooms()
            .flatMap(room => room.getSources())
            .filter(source => {
                return _.some(source.getHarvestSpots(), spot => {
                    return !spot.isBlocked() && !spot.isOccupied()
                        && !_.some(CreepStatic.getAll().filter(creep => {
                            const task = creep.getTask();
                            if (!task || !(task instanceof HarvestTask)) {
                                return false;
                            }

                            return task.source == source && task.spot == spot;
                        }));
                });
            })
            .map(source => new HarvestTask(source, _.sample(_.filter(source.getHarvestSpots(), spot => !spot.isBlocked() && !spot.isOccupied()
                && !_.some(CreepStatic.getAll().filter(creep => {
                    const task = creep.getTask();
                    if (!task || !(task instanceof HarvestTask)) {
                        return false;
                    }

                    return task.source == source && task.spot == spot;
                }))
            ))));
    }

    public toString = () : string => {
        return `${(this.constructor as any).name}(${this.spot})`;
    }
}