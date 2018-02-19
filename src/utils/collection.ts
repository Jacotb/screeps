export module Collection {
    export function range(start: number, end: number,): number[] {
        return Array.apply(null, Array(end - start + 1)).map(Number.prototype.valueOf, 0)
            .map((_: any, idx: number) => start + idx);
    }

    export function srt<T>(collection: T[], valuate: ((el: T) => number), ascending : boolean = true): T[] {
        return collection.sort((a, b) => {
            if (ascending){
                return valuate(a) - valuate(b);
            } else {
                return valuate(b) - valuate(a);
            }
        })
    }
}