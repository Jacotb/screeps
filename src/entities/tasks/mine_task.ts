import {Task} from "./task";
import {RoomStatic} from "../static/room_static";
import {CreepStatic} from "../static/creep_static";

export class MineTask extends Task {
    public constructor(public source: Source, public spot: RoomPosition) {
        super();
    }

    public serialize() {
        return {type: (this.constructor as any).name, source: this.source.id, spot: this.spot}
    }

    public static deserialize(data: any) {
        return new MineTask(Game.getObjectById(data.source) as Source, new RoomPosition(data.spot.x, data.spot.y, data.spot.roomName));
    }

    public bodyParts(): BodyPartConstant[] {
        return [MOVE, WORK];
    }

    public run(creep: Creep) {
        if (creep.carryCapacity > 0) {
            creep.removeTask();
            return;
        }

        const success = creep.harvest(this.source);
        if (!success) {
            creep.moveTo(this.spot);
        }
    }

    public startPoint(){
        return this.source.pos;
    }

    public static findAll(): MineTask[] {
        return RoomStatic.visibleRooms()
            .flatMap(room => room.getSources())
            .filter(source => {
                return _.some(source.getHarvestSpots(), spot => {
                    return _.some(spot.lookFor(LOOK_STRUCTURES), structure => structure.structureType == STRUCTURE_CONTAINER);
                }) && !_.some(CreepStatic.getAll().filter(creep => {
                    const task = creep.getTask();
                    if (!task || !(task instanceof MineTask)) {
                        return false;
                    }

                    return task.source == source;
                }));
            })
            .map(source => new MineTask(
                source,
                _.sample(
                    _.filter(
                        source.getHarvestSpots(),
                        spot => _.some(spot.lookFor(LOOK_STRUCTURES), structure => structure.structureType == STRUCTURE_CONTAINER)
                    )
                )
            ));
    }
}