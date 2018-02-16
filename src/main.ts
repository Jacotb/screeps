import {ErrorMapper} from "utils/ErrorMapper";
import {Builder} from "./entities/builder";
import "./entities/room";
import "./entities/spawn";
import "./entities/creep";
import "./entities/structure";
import "./entities/room_position";
import "./entities/source";
import {StructureSpawnStatic} from "./entities/static/spawn_static";
import {MemoryCleaner} from "./entities/memory_cleaner";
import {CreepStatic} from "./entities/static/creep_static";
import {TaskMaster} from "./entities/task_master";

export const loop = ErrorMapper.wrapLoop(() => {
    MemoryCleaner.run();

    Builder.run();

    StructureSpawnStatic.getAll().forEach(spawn => {
        spawn.run();
    });

    TaskMaster.run();

    CreepStatic.getAll().forEach(creep => {
        creep.run();
    });
});
