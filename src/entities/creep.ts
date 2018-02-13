import {Task} from "./tasks/task";
import {HarvestTask} from "./tasks/harvest_task";
import {MineTask} from "./tasks/mine_task";

Creep.prototype.run = function () {
    if (this.spawning) {
        return;
    }

    const task = this.getTask();
    if (!task) {
        return;
    }

    task.run(this);
};

Creep.prototype.setTask = function (task: Task) {
    this.memory.task = task.serialize();
};

Creep.prototype.getTask = function (): Task | null {
    if (!this.memory.task) {
        return null;
    }

    switch (this.memory.task.type) {
        case (HarvestTask as any).name:
            return HarvestTask.deserialize(this.memory.task);
        case (MineTask as any).name:
            return MineTask.deserialize(this.memory.task);
    }

    return null;
};

Creep.prototype.removeTask = function () {
    delete this.memory.task;
};
