export class CreepStatic {
    public static getAll(): Creep[] {
        return _.values(Game.creeps);
    }

    public static findAllByBodyParts(bodyParts: BodyPartConstant[]): Creep[] {
        return this.getAll().filter(creep => {
            return _.all(bodyParts, bodyPart => {
                return _.some(creep.body, bodyPartDefinition => bodyPartDefinition.type == bodyPart);
            });
        });
    }

    public static findAllByTask(taskName: string): Creep[] {
        return this.getAll().filter(creep => (creep.getTask() as any).name == taskName);
    }
}