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
        getAllSpots(): RoomPosition[];

        getSources(): Source[];

        getOwnEnergyStructures(): Structure[];

        getContainers(): StructureContainer[];

        getExtensions(): StructureExtension[];

        findExtensionSpot(closeTo: RoomPosition): RoomPosition;

        getOwnConstructionSites(): ConstructionSite[];

        planRoadCostMatrix(costMatrix: CostMatrix): CostMatrix;
    }


    interface RoomPosition {
        getRoom(): Room;

        getNeighbours(): RoomPosition[];

        getStraightNeighbours(): RoomPosition[];

        isBlocked(): boolean;

        hasRoad(): boolean;

        hasConstructionSite(): boolean;

        hasRoadConstructionSite(): boolean;

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

        buildControllerSupplyLines(visibleRooms: Room[]): void;

        buildExtensions(): void;

        spawnCreepForTask(task: Task): void;

        createBody(component: BodyPartConstant[]): BodyPartConstant[];

        bodyCost(body: BodyPartConstant[]): number;

        run(): void;
    }
}