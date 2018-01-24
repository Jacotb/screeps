module.exports = {
    run: function (creep, target, style, icon) {
        var moveResult = creep.moveTo(target, {visualizePathStyle: {stroke: style}});
        if (moveResult === OK) {
            creep.say("🏃" + icon);
            return true;
        } else if (moveResult === ERR_TIRED) {
            creep.say("😫" + icon);
            return true;
        } else if (moveResult === ERR_NO_PATH) {
            creep.say("🚧" + icon);
            return false;
        } else if (moveResult === ERR_INVALID_TARGET) {
            console.log("Invalid move target:", target);
            return false;
        } else {
            creep.say(moveResult + icon);
            return true;
        }
    }
};