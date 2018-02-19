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

        getOwnStructures(): Structure[];

        getOwnEnergyStructures(): Structure[];

        getContainers(): StructureContainer[];

        getExtensions(): StructureExtension[];

        getTowers(): StructureTower[];

        findExtensionSpot(closeTo: RoomPosition): RoomPosition;

        getOwnConstructionSites(): ConstructionSite[];

        planRoadCostMatrix(): CostMatrix;
    }


    interface RoomPosition {
        getRoom(): Room;

        getMultiRoomRangeTo(pos: RoomPosition): number;

        getNeighbours(): RoomPosition[];

        getStraightNeighbours(): RoomPosition[];

        isBlocked(): boolean;

        hasRoad(): boolean;

        hasConstructionSite(): boolean;

        hasRoadConstructionSite(): boolean;

        isOccupied(): boolean;

        isOccupiedBy(creep: Creep): boolean;

        isOccupiedButNotBy(creep: Creep): boolean;
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

        createBody(component: BodyPartConstant[], maxSize: number): BodyPartConstant[];

        bodyCost(body: BodyPartConstant[]): number;

        run(): void;
    }

    interface SpawnMemory {
        creepSize: number;
    }
}