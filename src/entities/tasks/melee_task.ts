import {Task} from "./task";
import {RoomStatic} from "../static/room_static";
import {BuildTask} from "./build_task";
import {CreepStatic} from "../static/creep_static";
import {PatrolTask} from "./patrol_task";

export class MeleeTask extends Task {
    public constructor(public target: Creep | Structure) {
        super();
    }

    public serialize() {
        return {
            type: (this.constructor as any).name,
            target: this.target.id
        }
    }

    public static deserialize(data: any) {
        const target = Game.getObjectById(data.target);
        if (target) {
            return new MeleeTask(target as Creep | Structure);
        } else {
            return null;
        }
    }

    public eligibleCreeps(): Creep[] {
        return CreepStatic.findAllByBodyParts(this.bodyParts()).filter(creep => creep.isIdle() || (creep.getTask() as any).constructor.name == (PatrolTask as any).name);
    }

    public bodyParts(): BodyPartConstant[] {
        return [MOVE, ATTACK];
    }

    public run(creep: Creep) {
        switch (creep.attack(this.target)) {
            case OK:
            case ERR_TIRED:
                break;
            case ERR_NOT_IN_RANGE:
                switch (creep.moveTo(this.target)) {
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
                creep.say('quit');
                creep.removeTask();
                break;
        }
    }

    public startPoint() {
        return this.target.pos;
    }

    public static findAll(): MeleeTask[] {
        return _.flatten(RoomStatic.visibleRooms()
            .map(room => room.find(FIND_HOSTILE_CREEPS)))
            .map(creep => {
                return new MeleeTask(creep);
            });
    }

    public isRepeatable(){
        return true;
    }

    public mayPreEmpt(){
        return true;
    }

    public toString = (): string => {
        return `${(this.constructor as any).name}(${this.target})`;
    }
}