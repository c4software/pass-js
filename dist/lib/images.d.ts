/**
 * Base PassImages class to add image filePath manipulation
 */
/// <reference types="node" />
export declare type ImageDensity = '1x' | '2x' | '3x';
export declare type ImageType = 'logo' | 'icon' | 'background' | 'footer' | 'strip' | 'thumbnail';
export declare const IMAGE_FILENAME_REGEX: RegExp;
export declare class PassImages extends Map<string, string | Buffer> {
    constructor(images?: PassImages);
    toArray(): Promise<{
        path: string;
        data: Buffer;
    }[]>;
    /**
     * Checks that all required images is set or throws elsewhere
     */
    validate(): void;
    /**
     * Load all images from the specified directory. Only supported images are
     * loaded, nothing bad happens if directory contains other files.
     *
     * @param {string} dirPath - path to a directory with images
     * @memberof PassImages
     */
    load(dirPath: string): Promise<this>;
    add(imageType: ImageType, pathOrBuffer: string | Buffer, density?: ImageDensity, lang?: string): Promise<void>;
    parseFilename(fileName: string): {
        imageType: ImageType;
        density?: ImageDensity;
        lang?: string;
    } | undefined;
    private checkImage;
    private getImageFilename;
}
