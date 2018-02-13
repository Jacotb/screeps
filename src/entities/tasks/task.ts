export abstract class Task {
    public abstract bodyParts(): BodyPartConstant[];

    public abstract run(creep: Creep): void;

    public toString = (): string => {
        return `${(this.constructor as any).name}`;
    };

    public abstract serialize(): any;
}

