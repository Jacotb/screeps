module.exports = {
    run: function(creep) {
        if(creep.room.name === creep.memory.target) {
            var nmCreeps = _.filter(creep.room.find(FIND_CREEPS), function(creep){
                return !creep.my;
            });
            target = creep.pos.findClosestByPath(nmCreeps);
            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES)
            }
            if(target) {
                result = creep.attack(target);
                if(result === OK){

                }else if(result === ERR_NOT_IN_RANGE){
                    creep.moveTo(target)
                } else if(result === ERR_NO_BODYPART){
                    result = creep.rangedAttack(target);
                    if(result === OK){

                    } else if(result === ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                    } else {
                        creep.say(result);
                    }
                } else {
                    creep.say(result);
                }
            } else {
                creep.move(_.sample([TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT]))
            }
        } else {
            var route = Game.map.findRoute(creep.room, creep.memory.target);
            if(route.length > 0) {
                creep.moveTo(creep.pos.findClosestByRange(route[0].exit))
            }
        }
    }
};