var utilMove = require('util.move');
var utilPosition = require('util.position');
var ul = require('util.lang');

module.exports = {
    Task: Object.freeze({reserve: 1}),
    ANTICIPATE_SOURCE_REGENERATION_DURATION: 24,

    run: function (creep, rooms) {
        var taskOngoing = false;
        var iterations = 0;
        while (!taskOngoing) {
            iterations++;
            switch (creep.memory.task) {
                case this.Task.reserve:
                    taskOngoing = this.reserve(creep, rooms);
                    break;
                default:
                    break;
            }

            if (!taskOngoing) {
                creep.memory.task = this.findTask(creep, rooms);
                this.resetTaskMemory(creep);
            }

            if (iterations > 3) {
                creep.say('no task');
                break;
            }
        }
    },

    resetTaskMemory: function (creep) {
        delete creep.memory.reserveTargetId;
    },

    findTask: function (creep, rooms) {
        var potentialTasks = [];
        var self = this;

        if (_.some(_.filter(ul.flatMap(rooms, function (room) {
                return room.controller;
            }), function (controller) {
                return (!controller.my);
            }))) {
            potentialTasks.push(self.Task.reserve);
        }

        return _.sample(potentialTasks);
    },

    reserve: function (creep, rooms) {
        var target;
        var self = this;

        if (creep.memory.reserveTargetId === undefined) {
            var controllers = _.filter(ul.flatMap(rooms, function (room) {
                return room.controller;
            }), function (controller) {
                return !controller.my;
            });

            if (_.some(controllers)) {
                target = _.sample(controllers);
                creep.memory.reserveTargetId =target.id
            } else {
                return false;
            }
        } else {
            target = Game.getObjectById(creep.memory.reserveTargetId);
            if (!target) {
                return false;
            }
        }

        var result = creep.claimController(target);
        if (result === OK) {
            creep.say("⚔️");
        } else if (result === ERR_NOT_IN_RANGE) {
            utilMove.run(creep, target, '#aa0000', '⚔️');
        } else if (result === ERR_TIRED) {
            creep.say("😴⚔️");
        } else if (result === ERR_GCL_NOT_ENOUGH) {
            if (target.owner === undefined && (target.reservation === undefined || target.reservation.username === creep.owner.username)){
                result = creep.reserveController(target);
            } else if (!target.my){
                result = creep.attackController(target);
            }
            if (result === OK) {
                creep.say("⚔️");
            } else if (result === ERR_NOT_IN_RANGE) {
                utilMove.run(creep, target, '#aa0000', '⚔️');
            } else if (result === ERR_TIRED) {
                creep.say("😴⚔️");
            } else {
                creep.say(result)
            }
            return true;
        }  else {
            creep.say(result)
        }
        return true;
    }
};