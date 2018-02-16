import {Task} from "./tasks/task";
import {MineTask} from "./tasks/mine_task";
import {HarvestTask} from "./tasks/harvest_task";
import {SupplyTask} from "./tasks/supply_task";
import {BuildTask} from "./tasks/build_task";
import {WithdrawTask} from "./tasks/withdraw_task";
import {UpgradeTask} from "./tasks/upgrade_task";
import {MeleeTask} from "./tasks/melee_task";
import {PatrolTask} from "./tasks/patrol_task";
import {ShootTask} from "./tasks/shoot_task";
import {RepairTask} from "./tasks/repair_task";

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
        }).forEach((taskCreepRange) => {
            if (taskCreepRange.task.mayPreEmpt() || taskCreepRange.creepRange.creep.isIdle()) {
                console.log(taskCreepRange.task, taskCreepRange.creepRange.range);
                taskCreepRange.creepRange.creep.setTask(taskCreepRange.task);
                if (!taskCreepRange.task.isRepeatable()) {
                    const index = this.availableTasks.indexOf(taskCreepRange.task);
                    this.availableTasks.splice(index, 1);
                }
            }
        });
    }

    public static getTaskFor(creep: Creep): Task {
        const task = _.sample(this.getAvailableTasks().filter(task => _.some(task.eligibleCreeps(), eligibleCreep => {
            eligibleCreep.id = creep.id;
        })));
        const index = this.availableTasks.indexOf(task);
        this.availableTasks.splice(index, 1);
        return task;
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
        return _.sample(this.getAvailableTasks());
    }

    public static taskTypes() {
        return [
            HarvestTask,
            MineTask,
            SupplyTask,
            BuildTask,
            WithdrawTask,
            UpgradeTask,
            MeleeTask,
            ShootTask,
            PatrolTask,
            RepairTask
        ];
    }
}