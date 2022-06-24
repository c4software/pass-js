import { Field, FieldDescriptor, DataStyleFormat } from '../interfaces';
export declare class FieldsMap extends Map<string, FieldDescriptor> {
    /**
     * Returns Map as array of objects with key moved inside like a key property
     */
    toJSON(): Field[] | undefined;
    /**
     * Adds a field to the end of the list
     *
     * @param {Field} field - Field key or object with all fields
     * @returns {FieldsMap}
     * @memberof FieldsMap
     */
    add(field: Field): this;
    /**
     * Sets value field for a given key, without changing the rest of field properties
     *
     * @param {string} key
     * @param {string} value
     * @memberof FieldsMap
     */
    setValue(key: string, value: string): this;
    /**
     * Set a field as Date value with appropriated options
     *
     * @param {string} key
     * @param {string} label
     * @param {Date} date
     * @param {{dateStyle?: string, ignoresTimeZone?: boolean, isRelative?: boolean, timeStyle?:string, changeMessage?: string}} [formatOptions]
     * @returns {FieldsMap}
     * @throws if date is not a Date or invalid Date
     * @memberof FieldsMap
     */
    setDateTime(key: string, label: string, date: Date, { dateStyle, ignoresTimeZone, isRelative, timeStyle, changeMessage, }?: {
        dateStyle?: DataStyleFormat;
        ignoresTimeZone?: boolean;
        isRelative?: boolean;
        timeStyle?: DataStyleFormat;
        changeMessage?: string;
    }): this;
}
