import {ErrorMapper} from "utils/ErrorMapper";
import {Builder} from "./entities/builder";
import "./entities/room";
import "./entities/spawn";
import {StructureSpawnStatic} from "./entities/static/spawn_static";
import {MemoryCleaner} from "./entities/memory_cleaner";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    console.log(`Current game tick is ${Game.time}`);

    MemoryCleaner.run();

    Builder.run();

    StructureSpawnStatic.getAll().forEach(spawn => {
        spawn.run();
    });
});
