"use strict";
/**
 * Class to handle Apple pass localizations
 *
 * @see {@link @see https://apple.co/2M9LWVu} - String Resources
 * @see {@link https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Creating.html#//apple_ref/doc/uid/TP40012195-CH4-SW54}
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Localizations = exports.getLprojBuffer = exports.readLprojStrings = exports.unescapeString = exports.escapeString = void 0;
const fs_1 = require("fs");
const readline_1 = require("readline");
const path = require("path");
const os_1 = require("os");
const normalize_locale_1 = require("./normalize-locale");
/**
 * Just as in C, some characters must be prefixed with a backslash before you can include them in the string.
 * These characters include double quotation marks, the backslash character itself,
 * and special control characters such as linefeed (\n) and carriage returns (\r).
 *
 * @see {@link https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/LoadingResources/Strings/Strings.html#//apple_ref/doc/uid/10000051i-CH6-SW13}
 */
function escapeString(str) {
    return str
        .replace(/["\\]/g, '\\$&') // quote and backslash
        .split(os_1.EOL)
        .join('\\n'); // escape new lines
}
exports.escapeString = escapeString;
function unescapeString(str) {
    return str
        .split('\\n') // new line
        .join(os_1.EOL)
        .replace(/\\(["\\])/g, '$1'); // quote and backslash
}
exports.unescapeString = unescapeString;
async function readStringsFromStream(stream) {
    const res = new Map();
    let nextLineIsComment = false;
    stream.setEncoding('utf-16le');
    const rl = (0, readline_1.createInterface)(stream);
    for await (const line of rl) {
        // skip empty lines
        const l = line.trim();
        if (!l)
            continue;
        // check if starts with '/*' and skip comments
        if (nextLineIsComment || l.startsWith('/*')) {
            nextLineIsComment = !l.endsWith('*/');
            continue;
        }
        // check for first quote, assignment operator, and final semicolon
        const test = /^"(?<msgId>.+)"\s*=\s*"(?<msgStr>.+)"\s*;/.exec(l);
        if (!test)
            continue;
        const { msgId, msgStr } = test.groups;
        res.set(unescapeString(msgId), unescapeString(msgStr));
    }
    return res;
}
/**
 * @see {@link https://github.com/justinklemm/i18n-strings-files/blob/dae303ed60d9d43dbe1a39bb66847be8a0d62c11/index.coffee#L100}
 * @param {string} filename - path to pass.strings file
 */
async function readLprojStrings(filename) {
    return readStringsFromStream((0, fs_1.createReadStream)(filename, { encoding: 'utf16le' }));
}
exports.readLprojStrings = readLprojStrings;
/**
 * Converts given translations map into UTF-16 encoded buffer in .lproj format
 *
 * @param {Map.<string, string>} strings
 */
function getLprojBuffer(strings) {
    /**
     * Just as in C, some characters must be prefixed with a backslash before you can include them in the string.
     * These characters include double quotation marks, the backslash character itself,
     * and special control characters such as linefeed (\n) and carriage returns (\r).
     *
     * @see {@link https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/LoadingResources/Strings/Strings.html#//apple_ref/doc/uid/10000051i-CH6-SW13}
     */
    return Buffer.from('\ufeff' /* byte order mark - UTF16 LE */ +
        [...strings]
            .map(([key, value]) => `"${escapeString(key)}" = "${escapeString(value)}";`)
            .join('\n'), // macOs compatible output for Buffer, so no EOL
    'utf16le');
}
exports.getLprojBuffer = getLprojBuffer;
/**
 * Localizations class Map<lang, Map<key, translation>>
 */
class Localizations extends Map {
    constructor(v) {
        // copy localizations if provided
        super(v instanceof Localizations
            ? [...v].map(([lang, map]) => [lang, new Map([...map])])
            : undefined);
    }
    /**
     *
     * @param {string} lang -  ISO 3166 alpha-2 code for the language
     * @param {{ [k: string]?: string }} values
     */
    add(lang, values) {
        const locale = (0, normalize_locale_1.normalizeLocale)(lang);
        const map = this.get(locale) || new Map();
        for (const [key, value] of Object.entries(values)) {
            map.set(key, value);
        }
        if (!this.has(lang))
            this.set(locale, map);
        return this;
    }
    toArray() {
        return [...this].map(([lang, map]) => ({
            path: `${lang}.lproj/pass.strings`,
            data: getLprojBuffer(map),
        }));
    }
    async addFile(language, filename) {
        this.set((0, normalize_locale_1.normalizeLocale)(language), await readLprojStrings(filename));
    }
    async addFromStream(language, stream) {
        this.set((0, normalize_locale_1.normalizeLocale)(language), await readStringsFromStream(stream));
    }
    /**
     * Loads available localizations from given folder path
     *
     * @param {string} dirPath
     */
    async load(dirPath) {
        const entries = await fs_1.promises.readdir(dirPath, { withFileTypes: true });
        const loaders = [];
        for (const entry of entries) {
            if (!entry.isDirectory())
                continue;
            // check if it's a localization folder
            const test = /^(?<lang>[-A-Z_a-z]+)\.lproj$/.exec(entry.name);
            if (!test)
                continue;
            const { lang } = test.groups;
            const currentPath = path.join(dirPath, entry.name);
            const localizations = await fs_1.promises.readdir(currentPath, {
                withFileTypes: true,
            });
            // check if it has strings and load
            if (localizations.find(f => f.isFile() && f.name === 'pass.strings'))
                loaders.push(this.addFile(lang, path.join(currentPath, 'pass.strings')));
        }
        await Promise.all(loaders);
    }
}
exports.Localizations = Localizations;
//# sourceMappingURL=localizations.js.map