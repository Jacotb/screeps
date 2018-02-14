import {Task} from "./task";
import {RoomStatic} from "../static/room_static";
import {CreepStatic} from "../static/creep_static";

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
        return new SupplyTask(Game.getObjectById(data.target) as Structure, data.resourceType as ResourceConstant, data.amount);
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

        const success = creep.transfer(this.target, this.resourceType, creep.carry.energy);
        if (success !== OK) {
            creep.say(success + "");
            const move = creep.moveTo(this.target);
            if (move !== OK) {
                creep.say(move + "");
            }
        }
    }

    public startPoint(){
        return this.target.pos;
    }

    public static findAll(): SupplyTask[] {
        return RoomStatic.visibleRooms()
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
            });
    }

    public toString = (): string => {
        return `${(this.constructor as any).name}(${this.target})`;
    }
}