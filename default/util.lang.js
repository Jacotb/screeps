module.exports = {
    flatMap: function (elements, predicate) {
        return [].concat.apply([], _.map(elements, predicate));
    }
};