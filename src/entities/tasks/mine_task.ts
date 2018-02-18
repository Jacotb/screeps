import {Task} from "./task";
import {RoomStatic} from "../static/room_static";
import {CreepStatic} from "../static/creep_static";
import {MeleeTask} from "./melee_task";

export class MineTask extends Task {
    public constructor(public source: Source, public spot: RoomPosition) {
        super();
    }

    public serialize() {
        return {type: (this.constructor as any).name, source: this.source.id, spot: this.spot}
    }

    public static deserialize(data: any) {
        const source = Game.getObjectById(data.source);
        if (source) {
            return new MineTask(source as Source, new RoomPosition(data.spot.x, data.spot.y, data.spot.roomName));
        } else {
            return null;
        }
    }

    public bodyParts(): BodyPartConstant[] {
        return [MOVE, WORK];
    }

    public eligibleCreeps() {
        return super.eligibleCreeps().filter(creep => {
            return !_.some(creep.body, bodyDef => {
                return bodyDef.type == CARRY;
            });
        });
    }

    public run(creep: Creep) {
        if (creep.carryCapacity > 0) {
            creep.removeTask();
            return;
        }

        if (!creep.pos.isEqualTo(this.spot)){
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

        switch (creep.harvest(this.source)) {
            case OK:
            case ERR_TIRED:
                break;
            case ERR_NOT_IN_RANGE:
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

    public startPoint(){
        return this.source.pos;
    }

    public static findAll(): MineTask[] {
        return _.flatten(RoomStatic.visibleRooms()
            .map(room => room.getSources()))
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

    public toString = (): string => {
        return `${(this.constructor as any).name}(${this.source})`;
    }
}