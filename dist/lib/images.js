/**
 * Base PassImages class to add image filePath manipulation
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassImages = exports.IMAGE_FILENAME_REGEX = void 0;
const util_1 = require("util");
const path = require("path");
const fs_1 = require("fs");
const imagesize = require("imagesize");
const constants_1 = require("../constants");
const normalize_locale_1 = require("./normalize-locale");
const imageSize = (0, util_1.promisify)(imagesize);
const IMAGES_TYPES = new Set(Object.keys(constants_1.IMAGES));
exports.IMAGE_FILENAME_REGEX = new RegExp(`(^|/)((?<lang>[-A-Z_a-z]+).lproj/)?(?<imageType>${Object.keys(constants_1.IMAGES).join('|')}+)(@(?<density>[23]x))?.png$`);
class PassImages extends Map {
    constructor(images) {
        super(images instanceof PassImages ? [...images] : undefined);
    }
    async toArray() {
        return Promise.all([...this].map(async ([filepath, pathOrBuffer]) => ({
            path: filepath,
            data: typeof pathOrBuffer === 'string'
                ? await fs_1.promises.readFile(pathOrBuffer)
                : pathOrBuffer,
        })));
    }
    /**
     * Checks that all required images is set or throws elsewhere
     */
    validate() {
        const keys = [...this.keys()];
        // Check for required images
        for (const requiredImage of ['icon', 'logo'])
            if (!keys.some(img => img.endsWith(`${requiredImage}.png`)))
                throw new SyntaxError(`Missing required image ${requiredImage}.png`);
    }
    /**
     * Load all images from the specified directory. Only supported images are
     * loaded, nothing bad happens if directory contains other files.
     *
     * @param {string} dirPath - path to a directory with images
     * @memberof PassImages
     */
    async load(dirPath) {
        var _a;
        // Check if the path is accessible directory actually
        const entries = await fs_1.promises.readdir(dirPath, { withFileTypes: true });
        // checking rest of files
        const entriesLoader = [];
        for (const entry of entries) {
            if (entry.isDirectory()) {
                // check if it's a localization folder
                const test = /(?<lang>[-A-Z_a-z]+)\.lproj/.exec(entry.name);
                if (!((_a = test === null || test === void 0 ? void 0 : test.groups) === null || _a === void 0 ? void 0 : _a.lang))
                    continue;
                const { lang } = test.groups;
                // reading this directory
                const currentPath = path.join(dirPath, entry.name);
                const localizations = await fs_1.promises.readdir(currentPath, {
                    withFileTypes: true,
                });
                // check if we have any localized images
                for (const f of localizations) {
                    const img = this.parseFilename(f.name);
                    if (img)
                        entriesLoader.push(this.add(img.imageType, path.join(currentPath, f.name), img.density, lang));
                }
            }
            else {
                // check it it's an image
                const img = this.parseFilename(entry.name);
                if (img)
                    entriesLoader.push(this.add(img.imageType, path.join(dirPath, entry.name), img.density));
            }
        }
        await Promise.all(entriesLoader);
        return this;
    }
    async add(imageType, pathOrBuffer, density, lang) {
        if (!IMAGES_TYPES.has(imageType))
            throw new TypeError(`Unknown image type ${imageSize} for ${imageType}`);
        if (density && !constants_1.DENSITIES.has(density))
            throw new TypeError(`Invalid density ${density} for ${imageType}`);
        // check data
        let sizeRes;
        if (typeof pathOrBuffer === 'string') {
            // PNG size is in first 24 bytes
            const rs = (0, fs_1.createReadStream)(pathOrBuffer, { highWaterMark: 30 });
            sizeRes = await imageSize(rs);
            // see https://github.com/nodejs/node/issues/25335#issuecomment-451945106
            rs.once('readable', () => rs.destroy());
        }
        else {
            if (!Buffer.isBuffer(pathOrBuffer))
                throw new TypeError(`Image data for ${imageType} must be either file path or buffer`);
            const { Parser } = imagesize;
            const parser = Parser();
            const res = parser.parse(pathOrBuffer);
            if (res !== Parser.DONE)
                throw new TypeError(`Supplied buffer doesn't contain valid PNG image for ${imageType}`);
            sizeRes = parser.getResult();
        }
        this.checkImage(imageType, sizeRes, density);
        super.set(this.getImageFilename(imageType, density, lang), pathOrBuffer);
    }
    parseFilename(fileName) {
        const test = exports.IMAGE_FILENAME_REGEX.exec(fileName);
        if (!(test === null || test === void 0 ? void 0 : test.groups))
            return undefined;
        const res = { imageType: test.groups.imageType };
        if (test.groups.density)
            res.density = test.groups.density;
        if (test.groups.lang)
            res.lang = (0, normalize_locale_1.normalizeLocale)(test.groups.lang);
        return res;
    }
    // eslint-disable-next-line complexity
    checkImage(imageType, sizeResult, density) {
        const densityMulti = density ? parseInt(density.charAt(0), 10) : 1;
        const { format, width, height } = sizeResult;
        if (format !== 'png')
            throw new TypeError(`Image for "${imageType}" is not a PNG file!`);
        if (!Number.isInteger(width) || width <= 0)
            throw new TypeError(`Image ${imageType} has invalid width: ${width}`);
        if (!Number.isInteger(height) || height <= 0)
            throw new TypeError(`Image ${imageType} has invalid height: ${height}`);
        /**
         * @see {@link https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Creating.html}
         */
        switch (imageType) {
            case 'icon':
                if (width < 29 * densityMulti)
                    throw new TypeError(`icon image must have width ${29 *
                        densityMulti}px for ${densityMulti}x density`);
                if (height < 29 * densityMulti)
                    throw new TypeError(`icon image must have height ${29 *
                        densityMulti}px for ${densityMulti}x density`);
                break;
            case 'logo':
                if (width > 160 * densityMulti)
                    throw new TypeError(`logo image must have width no large than ${160 *
                        densityMulti}px for ${densityMulti}x density`);
                // if (height > 50 * densityMulti)
                //   throw new TypeError(
                //     `logo image must have height ${50 *
                //       densityMulti}px for ${densityMulti}x density, received ${height}`,
                //   );
                break;
            case 'background':
                if (width > 180 * densityMulti)
                    throw new TypeError(`background image must have width ${180 *
                        densityMulti}px for ${densityMulti}x density`);
                if (height > 220 * densityMulti)
                    throw new TypeError(`background image must have height ${220 *
                        densityMulti}px for ${densityMulti}x density`);
                break;
            case 'footer':
                if (width > 286 * densityMulti)
                    throw new TypeError(`footer image must have width ${286 *
                        densityMulti}px for ${densityMulti}x density`);
                if (height > 15 * densityMulti)
                    throw new TypeError(`footer image must have height ${15 *
                        densityMulti}px for ${densityMulti}x density`);
                break;
            case 'strip':
                // if (width > 375 * densityMulti)
                //   throw new TypeError(
                //     `strip image must have width ${375 *
                //       densityMulti}px for ${densityMulti}x density, received ${width}`,
                //   );
                if (height > 144 * densityMulti)
                    throw new TypeError(`strip image must have height ${144 *
                        densityMulti}px for ${densityMulti}x density`);
                break;
            case 'thumbnail':
                if (width > 120 * densityMulti)
                    throw new TypeError(`thumbnail image must have width no large than ${90 *
                        densityMulti}px for ${densityMulti}x density, received ${width}`);
                if (height > 150 * densityMulti)
                    throw new TypeError(`thumbnail image must have height ${90 *
                        densityMulti}px for ${densityMulti}x density, received ${height}`);
                break;
        }
    }
    getImageFilename(imageType, density, lang) {
        return `${lang ? `${(0, normalize_locale_1.normalizeLocale)(lang)}.lproj/` : ''}${imageType}${/^[23]x$/.test(density || '') ? `@${density}` : ''}.png`;
    }
}
exports.PassImages = PassImages;
//# sourceMappingURL=images.js.map