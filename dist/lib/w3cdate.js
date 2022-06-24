'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateFromW3CString = exports.getW3CDateString = exports.isValidW3CDateString = void 0;
/**
 * Checks if given string is a valid W3C date representation
 *
 * @param {string} dateStr
 * @returns {boolean}
 */
function isValidW3CDateString(dateStr) {
    if (typeof dateStr !== 'string')
        return false;
    // W3C date format with optional seconds
    return /^20\d{2}-[01]\d-[0-3]\dT[0-5]\d:[0-5]\d(:[0-5]\d)?(Z|([+-][01]\d:[03]0)$)/.test(dateStr);
}
exports.isValidW3CDateString = isValidW3CDateString;
/**
 * Converts given string or Date instance into valid W3C date string
 *
 * @param {string | Date} value
 * @throws if given string can't be converted into w3C date
 * @returns {string}
 */
function getW3CDateString(value) {
    if (typeof value !== 'string' && !(value instanceof Date))
        throw new TypeError('Argument must be either a string or Date object');
    if (typeof value === 'string' && isValidW3CDateString(value))
        return value;
    const date = value instanceof Date ? value : new Date(value);
    // creating W3C date (we will always do without seconds)
    const month = (1 + date.getMonth()).toFixed().padStart(2, '0');
    const day = date
        .getDate()
        .toFixed()
        .padStart(2, '0');
    const hours = date
        .getHours()
        .toFixed()
        .padStart(2, '0');
    const minutes = date
        .getMinutes()
        .toFixed()
        .padStart(2, '0');
    const offset = -date.getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offset / 60))
        .toFixed()
        .padStart(2, '0');
    const offsetMinutes = (Math.abs(offset) - parseInt(offsetHours, 10) * 60)
        .toFixed()
        .padStart(2, '0');
    const offsetSign = offset < 0 ? '-' : '+';
    return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}${offsetSign}${offsetHours}:${offsetMinutes}`;
}
exports.getW3CDateString = getW3CDateString;
function getDateFromW3CString(value) {
    if (!isValidW3CDateString(value))
        throw new TypeError(`Date string ${value} is now a valid W3C date string`);
    const res = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T(?<hours>\d{2}):(?<mins>\d{2})(?<tzSign>[+-])(?<tzHour>\d{2}):(?<tzMin>\d{2})/.exec(value);
    if (!res)
        throw new TypeError(`Date string ${value} is now a valid W3C date string`);
    const { year, month, day, hours, mins, tzSign, tzHour, tzMin, } = res.groups;
    let utcdate = Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, // months are zero-offset (!)
    parseInt(day, 10), parseInt(hours, 10), parseInt(mins, 10)); // optional fraction
    // utcdate is milliseconds since the epoch
    const offsetMinutes = parseInt(tzHour, 10) * 60 + parseInt(tzMin, 10);
    utcdate += (tzSign === '+' ? -1 : +1) * offsetMinutes * 60000;
    return new Date(utcdate);
}
exports.getDateFromW3CString = getDateFromW3CString;
//# sourceMappingURL=w3cdate.js.map