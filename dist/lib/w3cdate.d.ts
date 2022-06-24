/**
 * Checks if given string is a valid W3C date representation
 *
 * @param {string} dateStr
 * @returns {boolean}
 */
export declare function isValidW3CDateString(dateStr: string): boolean;
/**
 * Converts given string or Date instance into valid W3C date string
 *
 * @param {string | Date} value
 * @throws if given string can't be converted into w3C date
 * @returns {string}
 */
export declare function getW3CDateString(value: string | Date): string;
export declare function getDateFromW3CString(value: string): Date;
