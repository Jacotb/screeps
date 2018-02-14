import {Task} from "./tasks/task";
import {MineTask} from "./tasks/mine_task";
import {HarvestTask} from "./tasks/harvest_task";
import {SupplyTask} from "./tasks/supply_task";
import {BuildTask} from "./tasks/build_task";

export class TaskMaster {
    private static availableTasks: Task[] = [];

    static run(): void {
        this.getAvailableTasks().filter(task => {
            return _.some(task.eligibleCreeps());
        }).map(task => {
            return {
                task, creepRange: _.first(task.eligibleCreeps().map(creep => {
                    return {creep, range: creep.pos.getRangeTo(task.startPoint())};
                }).sortBy(creepRange => {
                    return creepRange.range;
                }))
            };
        }).sortBy(taskCreepRange => {
            return taskCreepRange.creepRange.range
        }).forEach(taskCreepRange => {
            if (taskCreepRange.creepRange.creep.isIdle()) {
                taskCreepRange.creepRange.creep.setTask(taskCreepRange.task);
            }
        });
    }

    public static getGroupedTasks() {
        let availableTasks = this.getAvailableTasks();

        return availableTasks.groupBy(val => (val.constructor as any).name);
    }

    private static getAvailableTasks() {
        if (_.size(this.availableTasks) == 0) {
            this.taskTypes().map(taskType => taskType.findAll()).forEach(tasks => {
                this.availableTasks = this.availableTasks.concat(tasks);
            });
        }
        return this.availableTasks;
    }

    public static getCreepLessTask(spot: RoomPosition): Task {
        return _.first((this.getGroupedTasks().values().next().value as Task[]).sortBy(task => {
            return spot.getRangeTo(task.startPoint());
        }));
    }

    public static taskTypes() {
        return [
            HarvestTask,
            MineTask,
            SupplyTask,
            BuildTask
        ];
    }
}