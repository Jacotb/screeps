export class CreepStatic {
    static getAll(): Creep[] {
        return _.values(Game.creeps);
    }
}