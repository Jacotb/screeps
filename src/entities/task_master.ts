import {Task} from "./tasks/task";
import {MineTask} from "./tasks/mine_task";
import {HarvestTask} from "./tasks/harvest_task";
import {SupplyTask} from "./tasks/supply_task";
import {BuildTask} from "./tasks/build_task";
import {WithdrawTask} from "./tasks/withdraw_task";
import {UpgradeTask} from "./tasks/upgrade_task";

export class TaskMaster {
    private static availableTasks: Task[] = [];

    static run(): void {
        this.getAvailableTasks().map(task => {
            return {task, creeps: task.eligibleCreeps()};
        }).filter(taskCreeps => {
            return _.some(taskCreeps.creeps);
        }).map(taskCreeps => {
            return {
                task: taskCreeps.task, creepRange: _.sample(taskCreeps.creeps.map(creep => {
                    return {creep, range: creep.pos.getRangeTo(taskCreeps.task.startPoint())};
                }).sort((creepRangeA, creepRangeB) => {
                    return creepRangeA.range - creepRangeB.range;
                }))
            };
        }).sort((taskCreepRangeA, taskCreepRangeB) => {
            return taskCreepRangeA.creepRange.range - taskCreepRangeB.creepRange.range;
        }).forEach((taskCreepRange, index) => {
            if (taskCreepRange.creepRange.creep.isIdle()) {
                taskCreepRange.creepRange.creep.setTask(taskCreepRange.task);
                this.availableTasks.splice(index, 1);

            }
        });
    }

    public static getGroupedTasks() {
        return this.getAvailableTasks().groupBy(val => (val.constructor as any).name);
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
        return _.sample(this.getGroupedTasks().values().next().value as Task[]);
    }

    public static taskTypes() {
        return [
            HarvestTask,
            MineTask,
            SupplyTask,
            BuildTask,
            WithdrawTask,
            UpgradeTask
        ];
    }
}