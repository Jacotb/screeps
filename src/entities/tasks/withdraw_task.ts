import {Task} from "./task";
import {RoomStatic} from "../static/room_static";
import {CreepStatic} from "../static/creep_static";

export class WithdrawTask extends Task {
    public constructor(public source: Structure, public resourceType: ResourceConstant, public amount: number) {
        super();
    }

    public serialize() {
        return {
            type: (this.constructor as any).name,
            source: this.source.id,
            resourceType: this.resourceType
        }
    }

    public static deserialize(data: any) {
        return new WithdrawTask(Game.getObjectById(data.source) as Structure, data.resourceType as ResourceConstant, data.amount);
    }

    public bodyParts(): BodyPartConstant[] {
        return [MOVE, CARRY, CARRY];
    }

    public eligibleCreeps(): Creep[] {
        return super.eligibleCreeps().filter(creep => {
            return creep.carry.energy == 0;
        });
    }

    public run(creep: Creep) {
        if (creep.carry.energy > 0) {
            creep.removeTask();
            return;
        }


        switch (creep.withdraw(this.source, this.resourceType, Math.min(creep.carryCapacity, this.amount))) {
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
        return this.source.pos;
    }

    public static findAll(): WithdrawTask[] {
        const containers = RoomStatic.visibleRooms()
            .flatMap(room => room.getContainers());

        if (_.some(containers)) {
            return containers.map(container => {
                return {container, amount: container.store[RESOURCE_ENERGY]};
            })
                .filter(containerAmount => {
                    return containerAmount.amount > 0;
                })
                .map(containerAmount => {
                    return new WithdrawTask(containerAmount.container, RESOURCE_ENERGY, containerAmount.amount);
                });
        } else {
            const storages = <StructureStorage[]>RoomStatic.visibleRooms()
                .map(room => room.storage)
                .filter(storage => {
                    return storage !== undefined;
                });

            return storages.map(storage => {
                return {storage, amount: storage.store[RESOURCE_ENERGY]};
            })
                .filter(storageAmount => {
                    return storageAmount.amount > 0;
                })
                .map(storageAmount => {
                    return new WithdrawTask(storageAmount.storage, RESOURCE_ENERGY, storageAmount.amount);
                });
        }
    }

    public toString = (): string => {
        return `${(this.constructor as any).name}(${this.source})`;
    }
}