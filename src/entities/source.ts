Source.prototype.getHarvestSpots = function () {
    return this.pos.getNeighbours().filter(position => {
        return !position.isBlocked();
    });
};