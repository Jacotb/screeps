export class MemoryCleaner {
    static run(){
        if (Game.time % 1000 == 0) {
            this.cleanCreeps();
            this.cleanFlags();
        }
    }

    private static cleanCreeps() {
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                delete Memory.creeps[name];
            }
        }
    }

    private static cleanFlags() {
        for (const name in Memory.flags) {
            if (!(name in Game.flags)) {
                delete Memory.flags[name];
            }
        }
    }
}