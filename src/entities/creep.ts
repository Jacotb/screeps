import {Task} from "./tasks/task";
import {TaskMaster} from "./task_master";

Creep.prototype.run = function () {
    if (this.spawning) {
        return;
    }

    if (this.isIdle()) {
        return;
    }

    const task = (<Task>this.getTask());

    task.run(this);

    if (this.getTask()){
        this.setTask(task);
    }
};

Creep.prototype.setTask = function (task: Task) {
    this.memory.task = task.serialize();
};

Creep.prototype.getTask = function (): Task | null {
    if (!this.memory.task) {
        return null;
    }

    for (let taskType of TaskMaster.taskTypes()) {
        if (this.memory.task.type == (taskType as any).name) {
            return taskType.deserialize(this.memory.task);
        }
    }

    return null;
};

Creep.prototype.removeTask = function () {
    delete this.memory.task;
};


Creep.prototype.isIdle = function () {
    return this.getTask() == null;
};