import {Task} from "./task";
import {RoomStatic} from "../static/room_static";
import {CreepStatic} from "../static/creep_static";
import {SupplyTask} from "./supply_task";

export class RepairTask extends Task {
    public constructor(public target: Structure) {
        super();
    }

    public serialize() {
        return {
            type: (this.constructor as any).name,
            target: this.target.id
        }
    }

    public static deserialize(data: any) {
        return new RepairTask(Game.getObjectById(data.target) as Structure);
    }

    public bodyParts(): BodyPartConstant[] {
        return [MOVE, CARRY, WORK];
    }

    public eligibleCreeps(): Creep[] {
        return super.eligibleCreeps().filter(creep => {
            return creep.carry.energy > 0;
        });
    }

    public run(creep: Creep) {
        if (creep.carry.energy == 0 || this.target.hits >= this.target.hitsMax) {
            creep.removeTask();
            return;
        }

        switch (creep.repair(this.target)) {
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

    public static findAll(): RepairTask[] {
        return _.take(RoomStatic.visibleRooms()
            .flatMap(room => room.getOwnStructures())
            .map(structure => {
                let damage = structure.hitsMax - structure.hits;

                damage -= CreepStatic.findAllByTask((RepairTask as any).name)
                    .filter(creep => {
                        return (<RepairTask>creep.getTask()).target.id == structure.id;
                    })
                    .sum(creep => {
                        return creep.carry.energy;
                    });

                return {structure, damage};
            })
            .filter(structureDamage => {
                return structureDamage.damage > 0;
            }).sort((structureDamageA, structureDamageB) => {
                return structureDamageB.damage / structureDamageB.structure.hitsMax - structureDamageA.damage / structureDamageA.structure.hitsMax;
            }).map(structureDamage => {
                return new RepairTask(structureDamage.structure);
            }), 4);
    }

    public toString = (): string => {
        return `${(this.constructor as any).name}(${this.target})`;
    }
}