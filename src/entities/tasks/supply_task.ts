import {Task} from "./task";
import {RoomStatic} from "../static/room_static";
import {CreepStatic} from "../static/creep_static";
import {ShootTask} from "./shoot_task";
import {BuildTask} from "./build_task";

export class SupplyTask extends Task {
    public constructor(public target: Structure, public resourceType: ResourceConstant, public amount: number) {
        super();
    }

    public serialize() {
        return {
            type: (this.constructor as any).name,
            target: this.target.id,
            resourceType: this.resourceType,
            amount: this.amount
        }
    }

    public static deserialize(data: any) {
        const target = Game.getObjectById(data.target);
        if (target) {
            return new SupplyTask(target as Structure, data.resourceType as ResourceConstant, data.amount);
        } else {
            return null;
        }
    }

    public bodyParts(): BodyPartConstant[] {
        return [MOVE, CARRY, CARRY];
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

        let targetRemainingEnergyCapacity = 0;
        switch(this.target.structureType){
            case STRUCTURE_STORAGE:
                targetRemainingEnergyCapacity = (<StructureStorage>this.target).storeCapacity - _.sum((<StructureStorage>this.target).store);
                break;
            case STRUCTURE_EXTENSION:
                targetRemainingEnergyCapacity = (<StructureExtension>this.target).energyCapacity - (<StructureExtension>this.target).energy;
                break;
            case STRUCTURE_TOWER:
                targetRemainingEnergyCapacity = (<StructureTower>this.target).energyCapacity - (<StructureTower>this.target).energy;
                break;
            case STRUCTURE_SPAWN:
                targetRemainingEnergyCapacity = (<StructureSpawn>this.target).energyCapacity - (<StructureSpawn>this.target).energy;
                break;
        }

        if (targetRemainingEnergyCapacity == 0){
            creep.removeTask();
            return;
        }


        switch (creep.transfer(this.target, this.resourceType, Math.min(creep.carry.energy, targetRemainingEnergyCapacity))) {
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

    public static findAll(): SupplyTask[] {
        return _.take(RoomStatic.visibleRooms()
            .flatMap(room => room.getOwnEnergyStructures())
            .map(structure => {
                let missingEnergy = 0;
                switch (structure.structureType) {
                    case STRUCTURE_EXTENSION:
                        missingEnergy = (<StructureExtension>structure).energyCapacity - (<StructureExtension>structure).energy;
                        break;
                    case STRUCTURE_TOWER:
                        missingEnergy = (<StructureExtension>structure).energyCapacity - (<StructureExtension>structure).energy;
                        break;
                    case STRUCTURE_SPAWN:
                        missingEnergy = (<StructureExtension>structure).energyCapacity - (<StructureExtension>structure).energy;
                        break;
                    case STRUCTURE_STORAGE:
                        missingEnergy = (<StructureExtension>structure).energyCapacity - (<StructureExtension>structure).energy;
                        break;
                }

                missingEnergy -= CreepStatic.findAllByTask((SupplyTask as any).name)
                    .filter(creep => {
                        return (<SupplyTask>creep.getTask()).target == structure;
                    })
                    .sum(creep => {
                        return creep.carry.energy;
                    });

                return {structure, missingEnergy};
            })
            .filter(structureWithMissingEnergy => {
                return structureWithMissingEnergy.missingEnergy > 0;
            })
            .map(structureWithMissingEnergy => {
                return new SupplyTask(structureWithMissingEnergy.structure, RESOURCE_ENERGY, structureWithMissingEnergy.missingEnergy);
            }), 4 - _.size(CreepStatic.findAllByTask((SupplyTask as any).name)))
    }

    public toString = (): string => {
        return `${(this.constructor as any).name}(${this.target})`;
    }
}