export module Collection {
    export function range(start: number, end: number,): number[] {
        return Array.apply(null, Array(end - start + 1)).map(Number.prototype.valueOf, 0)
            .map((_: any, idx: number) => start + idx);
    }
}