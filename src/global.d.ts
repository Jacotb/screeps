import {Task} from "./entities/tasks/task";

export {}

declare global {
    interface Creep {
        run(): void;

        setTask(task: Task): void;

        getTask(): Task | null;

        removeTask(): void;

        isIdle(): boolean;
    }

    interface CreepMemory {
        task: any;
    }


    interface Room {
        getSources(): Source[];

        getOwnEnergyStructures(): Structure[];

        getContainers(): StructureContainer[];

        getOwnConstructionSites(): ConstructionSite[];

        planRoadCostMatrix(costMatrix: CostMatrix): CostMatrix;
    }

    interface RoomPosition {
        getRoom(): Room;

        getNeighbours(): RoomPosition[];

        isBlocked(): boolean;

        isOccupied(): boolean;
    }


    interface Source {
        getHarvestSpots(): RoomPosition[];
    }


    interface Structure {
        isBlocker(): boolean;

        isOwned(): this is AnyOwnedStructure;
    }


    interface StructureSpawn {
        buildSupplyLines(visibleRooms: Room[]): void;

        spawnCreepForTask(task: Task): void;

        run(): void;
    }
}