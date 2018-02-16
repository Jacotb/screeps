import {Task} from "./task";
import {RoomStatic} from "../static/room_static";
import {CreepStatic} from "../static/creep_static";
import {WithdrawTask} from "./withdraw_task";
import {SupplyTask} from "./supply_task";

export class UpgradeTask extends Task {
    public constructor(public target: StructureController) {
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
            return new UpgradeTask(target as StructureController);
        } else {
            return null;
        }
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
        if (creep.carry.energy == 0) {
            creep.removeTask();
            return;
        }


        switch (creep.upgradeController(this.target)) {
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
            case ERR_NOT_FOUND:
            case ERR_NOT_ENOUGH_RESOURCES:
            case ERR_NO_PATH:
            case ERR_NAME_EXISTS:
            case ERR_NOT_ENOUGH_ENERGY:
            case ERR_FULL:
            case ERR_INVALID_ARGS:
            case ERR_NOT_ENOUGH_EXTENSIONS:
            case ERR_RCL_NOT_ENOUGH:
            case ERR_GCL_NOT_ENOUGH:
                creep.say('quit');
                creep.removeTask();
                break;
        }
    }

    public startPoint() {
        return this.target.pos;
    }

    public static findAll(): UpgradeTask[] {
        const controllers = <StructureController[]>RoomStatic.visibleRooms()
            .map(room => room.controller)
            .filter(controller => {
                return controller !== undefined;
            });


        return controllers.filter(controller => {
            return controller.my;
        })
            .map(controller => {
                return new UpgradeTask(controller);
            });
    }

    public isRepeatable(){
        return true;
    }

    public toString = (): string => {
        return `${(this.constructor as any).name}(${this.target})`;
    }
}