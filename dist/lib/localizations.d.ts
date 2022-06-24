/**
 * Class to handle Apple pass localizations
 *
 * @see {@link @see https://apple.co/2M9LWVu} - String Resources
 * @see {@link https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Creating.html#//apple_ref/doc/uid/TP40012195-CH4-SW54}
 */
/// <reference types="node" />
/**
 * Just as in C, some characters must be prefixed with a backslash before you can include them in the string.
 * These characters include double quotation marks, the backslash character itself,
 * and special control characters such as linefeed (\n) and carriage returns (\r).
 *
 * @see {@link https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/LoadingResources/Strings/Strings.html#//apple_ref/doc/uid/10000051i-CH6-SW13}
 */
export declare function escapeString(str: string): string;
export declare function unescapeString(str: string): string;
/**
 * @see {@link https://github.com/justinklemm/i18n-strings-files/blob/dae303ed60d9d43dbe1a39bb66847be8a0d62c11/index.coffee#L100}
 * @param {string} filename - path to pass.strings file
 */
export declare function readLprojStrings(filename: string): Promise<Map<string, string>>;
/**
 * Converts given translations map into UTF-16 encoded buffer in .lproj format
 *
 * @param {Map.<string, string>} strings
 */
export declare function getLprojBuffer(strings: Map<string, string>): Buffer;
/**
 * Localizations class Map<lang, Map<key, translation>>
 */
export declare class Localizations extends Map<string, Map<string, string>> {
    constructor(v?: Localizations);
    /**
     *
     * @param {string} lang -  ISO 3166 alpha-2 code for the language
     * @param {{ [k: string]?: string }} values
     */
    add(lang: string, values: {
        [k: string]: string;
    }): this;
    toArray(): {
        path: string;
        data: Buffer;
    }[];
    addFile(language: string, filename: string): Promise<void>;
    addFromStream(language: string, stream: import('stream').Readable): Promise<void>;
    /**
     * Loads available localizations from given folder path
     *
     * @param {string} dirPath
     */
    load(dirPath: string): Promise<void>;
}
