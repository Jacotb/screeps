import {Collection} from "../../utils/collection";

export class RoomStatic {
    static visibleRooms(): Room[] {
        return _.values(Game.rooms);
    }

    static domainRoomNames(): string[] {
        return [
            'W79S83',
            'W78S83',
            'W79S84',
        ];
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

        return ['sim', ..._.flatten(xValues.map(xValue => {
            return yValues.map(yValue => {
                return xValue + yValue;
            })
        }))];
    }
}