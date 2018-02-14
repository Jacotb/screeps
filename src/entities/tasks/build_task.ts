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
        return new BuildTask(Game.getObjectById(data.target) as ConstructionSite);
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

        const success = creep.build(this.target);
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

    public static findAll(): BuildTask[] {
        return RoomStatic.visibleRooms()
            .flatMap(room => room.getOwnConstructionSites())
            .map(constructionSite => {
                let missingEnergy = constructionSite.progressTotal - constructionSite.progress;

                missingEnergy -= CreepStatic.findAllByTask((BuildTask as any).name)
                    .filter(creep => {
                        return (<BuildTask>creep.getTask()).target == constructionSite;
                    })
                    .sum(creep => {
                        return creep.carry.energy;
                    });

                return {constructionSite, missingEnergy};
            })
            .filter(constructionSiteWithMissingEnergy => {
                return constructionSiteWithMissingEnergy.missingEnergy > 0;
            })
            .map(constructionSiteWithMissingEnergy => {
                return new BuildTask(constructionSiteWithMissingEnergy.constructionSite);
            });
    }

    public toString = (): string => {
        return `${(this.constructor as any).name}(${this.target})`;
    }
}