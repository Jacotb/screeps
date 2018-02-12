export class StructureSpawnStatic {
    static getAll(): StructureSpawn[] {
        return _.values(Game.spawns);
    }
}