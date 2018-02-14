import {Task} from "./tasks/task";
import {MineTask} from "./tasks/mine_task";
import {HarvestTask} from "./tasks/harvest_task";
import {SupplyTask} from "./tasks/supply_task";

export class TaskMaster {
    private static availableTasks: Task[] = [];

    static run(): void {
        _.shuffle(this.getAvailableTasks()).forEach(task => {
            const creep = _.sample(task.eligibleCreeps());
            if (creep){
                _.sample(task.eligibleCreeps()).setTask(task);
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

    public static getCreepLessTask() {
        return _.sample(this.getGroupedTasks().values().next().value) as Task;
    }

    public static taskTypes() {
        return [
            HarvestTask,
            MineTask,
            SupplyTask
        ];
    }
}