RoomPosition.prototype.getRoom = function () {
    const room = Game.rooms[this.roomName];
    if (room) {
        return room;
    } else {
        throw new Error('Could not get room');
    }
};

RoomPosition.prototype.getNeighbours = function () {
    const room = this.getRoom();
    return [
        room.getPositionAt(this.x - 1, this.y - 1),
        room.getPositionAt(this.x, this.y - 1),
        room.getPositionAt(this.x + 1, this.y - 1),
        room.getPositionAt(this.x - 1, this.y),
        room.getPositionAt(this.x + 1, this.y),
        room.getPositionAt(this.x - 1, this.y + 1),
        room.getPositionAt(this.x, this.y + 1),
        room.getPositionAt(this.x + 1, this.y + 1)
    ].filter(position => position != null) as RoomPosition[];
};

RoomPosition.prototype.isBlocked = function () {
    return _.some(this.lookFor(LOOK_TERRAIN), terrain => terrain == "wall")
        || _.some(this.lookFor(LOOK_STRUCTURES), structure => structure.isBlocker());
};

RoomPosition.prototype.isOccupied = function () {
    return _.some(_.values(Game.creeps) as Creep[], creep => {
        return creep.pos.isEqualTo(this);
    });
};

RoomPosition.prototype.toString = function() {
    return `${this.getRoom().name}(${this.x},${this.y})`;
};