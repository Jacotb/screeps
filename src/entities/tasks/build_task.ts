import {Task} from "./task";
import {RoomStatic} from "../static/room_static";
import {CreepStatic} from "../static/creep_static";
import {SupplyTask} from "./supply_task";

export class BuildTask extends Task {
    public constructor(public target: ConstructionSite) {
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
            return new BuildTask(target as ConstructionSite);
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

        switch (creep.build(this.target)) {
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
            case ERR_RCL_NOT_ENOUGH:
                creep.say('quit');
                creep.removeTask();
                break;
        }
    }

    public startPoint() {
        return this.target.pos;
    }

    public static findAll(): BuildTask[] {
        return _.take(RoomStatic.visibleRooms()
            .flatMap(room => room.getOwnConstructionSites())
            .map(constructionSite => {
                let missingEnergy = constructionSite.progressTotal - constructionSite.progress;

                missingEnergy -= CreepStatic.findAllByTask((BuildTask as any).name)
                    .filter(creep => {
                        return (<BuildTask>creep.getTask()).target.id == constructionSite.id;
                    })
                    .sum(creep => {
                        return creep.carry.energy;
                    });

                return {constructionSite, missingEnergy};
            }).filter(constructionSiteWithMissingEnergy => {
                return constructionSiteWithMissingEnergy.missingEnergy > 0;
            }).sort((constructionSiteWithMissingEnergyA, constructionSiteWithMissingEnergyB) => {
                return constructionSiteWithMissingEnergyB.constructionSite.progress / constructionSiteWithMissingEnergyB.constructionSite.progressTotal
                    - constructionSiteWithMissingEnergyA.constructionSite.progress / constructionSiteWithMissingEnergyA.constructionSite.progressTotal;
            }).map(constructionSiteWithMissingEnergy => {
                return new BuildTask(constructionSiteWithMissingEnergy.constructionSite);
            }), 4 - _.size(CreepStatic.findAllByTask((BuildTask as any).name)));
    }

    public toString = (): string => {
        return `${(this.constructor as any).name}(${this.target})`;
    }
}