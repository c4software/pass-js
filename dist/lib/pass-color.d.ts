/**
 *  returns current value as [r,g,b] array, but stringifies to JSON as string 'rgb(r, g, b)'
 */
export declare class PassColor extends Array<number> {
    constructor(v?: string | [number, number, number] | PassColor);
    set(v: string | PassColor | [number, number, number]): this;
    toJSON(): string | undefined;
}
