import {HarvestTask} from "./tasks/harvest_task";
import {MineTask} from "./tasks/mine_task";
import {Task} from "./tasks/task";

export class TaskMaster {
    static run(): void {


    }

    public static getGroupedTasks() {
        const tasks = [
            ...HarvestTask.findAll(),
            ...MineTask.findAll()
        ];

        return tasks.groupBy(val => (val.constructor as any).name);
    }

    public static getCreepLessTask(){
        return _.sample(this.getGroupedTasks().values().next().value) as Task;
    }
}