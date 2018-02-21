import {CreepStatic} from "../static/creep_static";

export abstract class Task {
    public abstract bodyParts(): BodyPartConstant[];

    public eligibleCreeps(): Creep[] {
        return CreepStatic.findAllByBodyParts(this.bodyParts()).filter(creep => creep.isIdle());
    }

    public abstract run(creep: Creep): void;

    public toString = (): string => {
        return `${(this.constructor as any).name}`;
    };

    public abstract serialize(): any;

    public abstract startPoint(): RoomPosition;

    public isRepeatable() {
        return false;
    }

    public mayPreEmpt() {
        return false;
    }

    public static maxConcurrentTasks() {
        return 8;
    }
}
