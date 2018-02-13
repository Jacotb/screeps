Structure.prototype.isBlocker = function () {
    return this.structureType == STRUCTURE_WALL
        || this.structureType == STRUCTURE_EXTENSION
        || this.structureType == STRUCTURE_LAB
        || this.structureType == STRUCTURE_TOWER
        || this.structureType == STRUCTURE_LINK
        || this.structureType == STRUCTURE_SPAWN
        || this.structureType == STRUCTURE_CONTROLLER
        || this.structureType == STRUCTURE_STORAGE
        || this.structureType == STRUCTURE_EXTRACTOR
        || this.structureType == STRUCTURE_KEEPER_LAIR
        || this.structureType == STRUCTURE_NUKER
        || this.structureType == STRUCTURE_OBSERVER
        || this.structureType == STRUCTURE_PORTAL
        || this.structureType == STRUCTURE_POWER_BANK
        || this.structureType == STRUCTURE_POWER_SPAWN
        || this.structureType == STRUCTURE_TERMINAL;
};