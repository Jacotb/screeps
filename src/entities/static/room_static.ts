import {Collection} from "../../utils/collection";

export class RoomStatic {
    static visibleRooms(): Room[] {
        return _.values(Game.rooms);
    }

    static availableRoomNames(): string[] {
        return _.filter(this.allRoomNames(), Game.map.isRoomAvailable);
    }

    static allRoomNames(): string[] {
        let xValues = [
            ...Collection.range(0, 100).map(idx => {
                return `W${idx}`;
            }),
            ...Collection.range(0, 100).map(idx => {
                return `E${idx}`;
            })
        ];

        let yValues = [
            ...Collection.range(0, 100).map(idx => {
                return `N${idx}`;
            }),
            ...Collection.range(0, 100).map(idx => {
                return `S${idx}`;
            })
        ];

        return ['sim', ...xValues.flatMap(xValue => {
            return yValues.map(yValue => {
                return xValue + yValue;
            })
        })];
    }
}