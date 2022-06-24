/// <reference types="node" />
import { PassImages } from './lib/images';
import { PassBase } from './lib/base-pass';
import { ApplePass, Options } from './interfaces';
export declare class Pass extends PassBase {
    private readonly template;
    constructor(template: import('./template').Template, fields?: Partial<ApplePass>, images?: PassImages, localization?: import('./lib/localizations').Localizations, options?: Options);
    validate(): void;
    /**
     * Returns Pass as a Buffer
     *
     * @memberof Pass
     * @returns {Promise.<Buffer>}
     */
    asBuffer(): Promise<Buffer>;
}
