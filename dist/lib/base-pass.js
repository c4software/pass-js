"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassBase = void 0;
const constants_1 = require("../constants");
const pass_color_1 = require("./pass-color");
const images_1 = require("./images");
const localizations_1 = require("./localizations");
const get_geo_point_1 = require("./get-geo-point");
const pass_structure_1 = require("./pass-structure");
const w3cdate_1 = require("./w3cdate");
const STRUCTURE_FIELDS_SET = new Set([...constants_1.STRUCTURE_FIELDS, 'nfc']);
class PassBase extends pass_structure_1.PassStructure {
    constructor(fields = {}, images, localizations, options) {
        super(fields);
        this.options = options;
        // restore via setters
        for (const [key, value] of Object.entries(fields)) {
            if (!STRUCTURE_FIELDS_SET.has(key) && key in this) {
                this[key] = value;
            }
        }
        // copy images
        this.images = new images_1.PassImages(images);
        // copy localizations
        this.localization = new localizations_1.Localizations(localizations);
    }
    // Returns the pass.json object (not a string).
    toJSON() {
        const res = { formatVersion: 1 };
        for (const [field, value] of Object.entries(this.fields)) {
            res[field] = value instanceof Date ? (0, w3cdate_1.getW3CDateString)(value) : value;
        }
        return res;
    }
    get passTypeIdentifier() {
        return this.fields.passTypeIdentifier;
    }
    set passTypeIdentifier(v) {
        if (!v)
            delete this.fields.passTypeIdentifier;
        else
            this.fields.passTypeIdentifier = v;
    }
    get teamIdentifier() {
        return this.fields.teamIdentifier;
    }
    set teamIdentifier(v) {
        if (!v)
            delete this.fields.teamIdentifier;
        else
            this.fields.teamIdentifier = v;
    }
    get serialNumber() {
        return this.fields.serialNumber;
    }
    set serialNumber(v) {
        if (!v)
            delete this.fields.serialNumber;
        else
            this.fields.serialNumber = v;
    }
    /**
     *  Indicates that the sharing of pass can be prohibited.
     *
     * @type {boolean}
     */
    get sharingProhibited() {
        return this.fields.sharingProhibited;
    }
    set sharingProhibited(v) {
        if (!v)
            delete this.fields.sharingProhibited;
        else
            this.fields.sharingProhibited = true;
    }
    /**
     *  Indicates that the pass is void—for example, a one time use coupon that has been redeemed.
     *
     * @type {boolean}
     */
    get voided() {
        return !!this.fields.voided;
    }
    set voided(v) {
        if (v)
            this.fields.voided = true;
        else
            delete this.fields.voided;
    }
    /**
     * Date and time when the pass expires.
     *
     */
    get expirationDate() {
        if (typeof this.fields.expirationDate === 'string')
            return new Date(this.fields.expirationDate);
        return this.fields.expirationDate;
    }
    set expirationDate(v) {
        if (!v)
            delete this.fields.expirationDate;
        else {
            if (v instanceof Date) {
                if (!Number.isFinite(v.getTime()))
                    throw new TypeError(`Value for expirationDate must be a valid Date, received ${v}`);
                this.fields.expirationDate = v;
            }
            else if (typeof v === 'string') {
                if ((0, w3cdate_1.isValidW3CDateString)(v))
                    this.fields.expirationDate = v;
                else {
                    const date = new Date(v);
                    if (!Number.isFinite(date.getTime()))
                        throw new TypeError(`Value for expirationDate must be a valid Date, received ${v}`);
                    this.fields.expirationDate = date;
                }
            }
        }
    }
    /**
     * Date and time when the pass becomes relevant. For example, the start time of a movie.
     * Recommended for event tickets and boarding passes; otherwise optional.
     *
     * @type {string | Date}
     */
    get relevantDate() {
        if (typeof this.fields.relevantDate === 'string')
            return new Date(this.fields.relevantDate);
        return this.fields.relevantDate;
    }
    set relevantDate(v) {
        if (!v)
            delete this.fields.relevantDate;
        else {
            if (v instanceof Date) {
                if (!Number.isFinite(v.getTime()))
                    throw new TypeError(`Value for relevantDate must be a valid Date, received ${v}`);
                this.fields.relevantDate = v;
            }
            else if (typeof v === 'string') {
                if ((0, w3cdate_1.isValidW3CDateString)(v))
                    this.fields.relevantDate = v;
                else {
                    const date = new Date(v);
                    if (!Number.isFinite(date.getTime()))
                        throw new TypeError(`Value for relevantDate must be a valid Date, received ${v}`);
                    this.fields.relevantDate = date;
                }
            }
        }
    }
    /**
     * A list of iTunes Store item identifiers for the associated apps.
     * Only one item in the list is used—the first item identifier for an app
     * compatible with the current device.
     * If the app is not installed, the link opens the App Store and shows the app.
     * If the app is already installed, the link launches the app.
     */
    get associatedStoreIdentifiers() {
        return this.fields.associatedStoreIdentifiers;
    }
    set associatedStoreIdentifiers(v) {
        if (!v) {
            delete this.fields.associatedStoreIdentifiers;
            return;
        }
        const arrayOfNumbers = v.filter(n => Number.isInteger(n));
        if (arrayOfNumbers.length > 0)
            this.fields.associatedStoreIdentifiers = arrayOfNumbers;
        else
            delete this.fields.associatedStoreIdentifiers;
    }
    /**
     * Brief description of the pass, used by the iOS accessibility technologies.
     * Don’t try to include all of the data on the pass in its description,
     * just include enough detail to distinguish passes of the same type.
     */
    get description() {
        return this.fields.description;
    }
    set description(v) {
        if (!v)
            delete this.fields.description;
        else
            this.fields.description = v;
    }
    /**
     * Display name of the organization that originated and signed the pass.
     */
    get organizationName() {
        return this.fields.organizationName;
    }
    set organizationName(v) {
        if (!v)
            delete this.fields.organizationName;
        else
            this.fields.organizationName = v;
    }
    /**
     * Optional for event tickets and boarding passes; otherwise not allowed.
     * Identifier used to group related passes.
     * If a grouping identifier is specified, passes with the same style,
     * pass type identifier, and grouping identifier are displayed as a group.
     * Otherwise, passes are grouped automatically.
     * Use this to group passes that are tightly related,
     * such as the boarding passes for different connections of the same trip.
     */
    get groupingIdentifier() {
        return this.fields.groupingIdentifier;
    }
    set groupingIdentifier(v) {
        if (!v)
            delete this.fields.groupingIdentifier;
        else
            this.fields.groupingIdentifier = v;
    }
    /**
     * If true, the strip image is displayed without a shine effect.
     * The default value prior to iOS 7.0 is false.
     * In iOS 7.0, a shine effect is never applied, and this key is deprecated.
     */
    get suppressStripShine() {
        return !!this.fields.suppressStripShine;
    }
    set suppressStripShine(v) {
        if (!v)
            delete this.fields.suppressStripShine;
        else
            this.fields.suppressStripShine = true;
    }
    /**
     * Text displayed next to the logo on the pass.
     */
    get logoText() {
        return this.fields.logoText;
    }
    set logoText(v) {
        if (!v)
            delete this.fields.logoText;
        else
            this.fields.logoText = v;
    }
    /**
     * The URL of a web service that conforms to the API described in PassKit Web Service Reference.
     * The web service must use the HTTPS protocol in production; the leading https:// is included in the value of this key.
     * On devices configured for development, there is UI in Settings to allow HTTP web services. You can use the options
     * parameter to set allowHTTP to be able to use URLs that use the HTTP protocol.
     *
     * @see {@link https://developer.apple.com/library/archive/documentation/PassKit/Reference/PassKit_WebService/WebService.html#//apple_ref/doc/uid/TP40011988}
     */
    get webServiceURL() {
        return this.fields.webServiceURL;
    }
    set webServiceURL(v) {
        var _a, _b;
        if (!v) {
            delete this.fields.webServiceURL;
            return;
        }
        // validating URL, it will throw on bad value
        const url = v instanceof URL ? v : new URL(v);
        const allowHttp = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.allowHttp) !== null && _b !== void 0 ? _b : false;
        if (!allowHttp && url.protocol !== 'https:') {
            throw new TypeError(`webServiceURL must be on HTTPS!`);
        }
        this.fields.webServiceURL = v;
    }
    /**
     * The authentication token to use with the web service.
     * The token must be 16 characters or longer.
     */
    get authenticationToken() {
        return this.fields.authenticationToken;
    }
    set authenticationToken(v) {
        if (!v) {
            delete this.fields.authenticationToken;
            return;
        }
        if (typeof v !== 'string')
            throw new TypeError(`authenticationToken must be a string, received ${typeof v}`);
        if (v.length < 16)
            throw new TypeError(`authenticationToken must must be 16 characters or longer`);
        this.fields.authenticationToken = v;
    }
    /**
     * Background color of the pass, specified as an CSS-style RGB triple.
     *
     * @example rgb(23, 187, 82)
     */
    get backgroundColor() {
        if (!(this.fields.backgroundColor instanceof pass_color_1.PassColor))
            return undefined;
        return this.fields.backgroundColor;
    }
    set backgroundColor(v) {
        if (!v) {
            delete this.fields.backgroundColor;
            return;
        }
        if (!(this.fields.backgroundColor instanceof pass_color_1.PassColor))
            this.fields.backgroundColor = new pass_color_1.PassColor(v);
        else
            this.fields.backgroundColor.set(v);
    }
    /**
     * Foreground color of the pass, specified as a CSS-style RGB triple.
     *
     * @example rgb(100, 10, 110)
     */
    get foregroundColor() {
        if (!(this.fields.foregroundColor instanceof pass_color_1.PassColor))
            return undefined;
        return this.fields.foregroundColor;
    }
    set foregroundColor(v) {
        if (!v) {
            delete this.fields.foregroundColor;
            return;
        }
        if (!(this.fields.foregroundColor instanceof pass_color_1.PassColor))
            this.fields.foregroundColor = new pass_color_1.PassColor(v);
        else
            this.fields.foregroundColor.set(v);
    }
    /**
     * Color of the label text, specified as a CSS-style RGB triple.
     *
     * @example rgb(255, 255, 255)
     */
    get labelColor() {
        if (!(this.fields.labelColor instanceof pass_color_1.PassColor))
            return undefined;
        return this.fields.labelColor;
    }
    set labelColor(v) {
        if (!v) {
            delete this.fields.labelColor;
            return;
        }
        if (!(this.fields.labelColor instanceof pass_color_1.PassColor))
            this.fields.labelColor = new pass_color_1.PassColor(v);
        else
            this.fields.labelColor.set(v);
    }
    /**
     * Color of the strip text, specified as a CSS-style RGB triple.
     *
     * @example rgb(255, 255, 255)
     */
    get stripColor() {
        if (!(this.fields.stripColor instanceof pass_color_1.PassColor))
            return undefined;
        return this.fields.stripColor;
    }
    set stripColor(v) {
        if (!v) {
            delete this.fields.stripColor;
            return;
        }
        if (!(this.fields.stripColor instanceof pass_color_1.PassColor))
            this.fields.stripColor = new pass_color_1.PassColor(v);
        else
            this.fields.stripColor.set(v);
    }
    /**
     * Maximum distance in meters from a relevant latitude and longitude that the pass is relevant.
     * This number is compared to the pass’s default distance and the smaller value is used.
     */
    get maxDistance() {
        return this.fields.maxDistance;
    }
    set maxDistance(v) {
        if (!v) {
            delete this.fields.maxDistance;
            return;
        }
        if (!Number.isInteger(v))
            throw new TypeError('maxDistance must be a positive integer distance in meters!');
        this.fields.maxDistance = v;
    }
    /**
     * Beacons marking locations where the pass is relevant.
     */
    get beacons() {
        return this.fields.beacons;
    }
    set beacons(v) {
        if (!v || !Array.isArray(v)) {
            delete this.fields.beacons;
            return;
        }
        for (const beacon of v) {
            if (!beacon.proximityUUID)
                throw new TypeError(`each beacon must contain proximityUUID`);
        }
        // copy array
        this.fields.beacons = [...v];
    }
    /**
     * Information specific to the pass’s barcode.
     * The system uses the first valid barcode dictionary in the array.
     * Additional dictionaries can be added as fallbacks.
     */
    get barcodes() {
        return this.fields.barcodes;
    }
    set barcodes(v) {
        if (!v) {
            delete this.fields.barcodes;
            delete this.fields.barcode;
            return;
        }
        if (!Array.isArray(v))
            throw new TypeError(`barcodes must be an Array, received ${typeof v}`);
        // Barcodes dictionary: https://developer.apple.com/library/content/documentation/UserExperience/Reference/PassKit_Bundle/Chapters/LowerLevel.html#//apple_ref/doc/uid/TP40012026-CH3-SW3
        for (const barcode of v) {
            if (!constants_1.BARCODES_FORMAT.has(barcode.format))
                throw new TypeError(`Barcode format value ${barcode.format} is invalid!`);
            if (typeof barcode.message !== 'string')
                throw new TypeError('Barcode message string is required');
            if (typeof barcode.messageEncoding !== 'string')
                throw new TypeError('Barcode messageEncoding is required');
        }
        // copy array
        this.fields.barcodes = [...v];
    }
    /**
     * Adds a location where a pass is relevant.
     *
     * @param {number[] | { lat: number, lng: number, alt?: number } | { longitude: number, latitude: number, altitude?: number }} point
     * @param {string} [relevantText]
     * @returns {this}
     */
    addLocation(point, relevantText) {
        const { longitude, latitude, altitude } = (0, get_geo_point_1.getGeoPoint)(point);
        const location = {
            longitude,
            latitude,
        };
        if (altitude)
            location.altitude = altitude;
        if (typeof relevantText === 'string')
            location.relevantText = relevantText;
        if (!Array.isArray(this.fields.locations))
            this.fields.locations = [location];
        else
            this.fields.locations.push(location);
        return this;
    }
    get locations() {
        return this.fields.locations;
    }
    set locations(v) {
        delete this.fields.locations;
        if (!v)
            return;
        if (!Array.isArray(v))
            throw new TypeError(`locations must be an array`);
        else
            for (const location of v)
                this.addLocation(location, location.relevantText);
    }
}
exports.PassBase = PassBase;
//# sourceMappingURL=base-pass.js.map