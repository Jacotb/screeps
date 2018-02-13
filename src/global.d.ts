import {Task} from "./entities/tasks/task";

export {}

declare global {
    interface Creep {
        run(): void;

        setTask(task: Task): void;

        getTask(): Task | null;

        removeTask(): void;
    }

    interface CreepMemory {
        task: any;
    }


    interface Room {
        getSources(): Source[];

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
    }


    interface StructureSpawn {
        buildSupplyLines(visibleRooms: Room[]): void;

        spawnCreepForTask(task: Task): void;

        run(): void;
    }
}