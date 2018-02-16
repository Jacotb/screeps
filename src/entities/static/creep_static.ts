import {Task} from "../tasks/task";

export class CreepStatic {
    public static getAll(): Creep[] {
        return _.values(Game.creeps);
    }

    public static findAllByBodyParts(bodyParts: BodyPartConstant[]): Creep[] {
        return this.getAll().filter(creep => {
            return _.all(bodyParts, bodyPart => {
                return _.some(creep.body, bodyPartDefinition => bodyPartDefinition.type == bodyPart && bodyPartDefinition.hits > 0);
            });
        });
    }

    public static findAllByTask(taskName: string): Creep[] {
        return this.getAll().filter(creep => {
            return creep.getTask() !== null && ((<Task>creep.getTask()).constructor  as any).name == taskName;
        });
    }
}