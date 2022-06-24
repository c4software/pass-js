import { ApplePass, Options } from '../interfaces';
import { PassColor } from './pass-color';
import { PassImages } from './images';
import { Localizations } from './localizations';
import { PassStructure } from './pass-structure';
export declare class PassBase extends PassStructure {
    readonly images: PassImages;
    readonly localization: Localizations;
    readonly options: Options | undefined;
    constructor(fields?: Partial<ApplePass>, images?: PassImages, localizations?: Localizations, options?: Options);
    toJSON(): Partial<ApplePass>;
    get passTypeIdentifier(): string | undefined;
    set passTypeIdentifier(v: string | undefined);
    get teamIdentifier(): string | undefined;
    set teamIdentifier(v: string | undefined);
    get serialNumber(): string | undefined;
    set serialNumber(v: string | undefined);
    /**
     *  Indicates that the sharing of pass can be prohibited.
     *
     * @type {boolean}
     */
    get sharingProhibited(): boolean | undefined;
    set sharingProhibited(v: boolean | undefined);
    /**
     *  Indicates that the pass is void—for example, a one time use coupon that has been redeemed.
     *
     * @type {boolean}
     */
    get voided(): boolean;
    set voided(v: boolean);
    /**
     * Date and time when the pass expires.
     *
     */
    get expirationDate(): ApplePass['expirationDate'];
    set expirationDate(v: ApplePass['expirationDate']);
    /**
     * Date and time when the pass becomes relevant. For example, the start time of a movie.
     * Recommended for event tickets and boarding passes; otherwise optional.
     *
     * @type {string | Date}
     */
    get relevantDate(): ApplePass['relevantDate'];
    set relevantDate(v: ApplePass['relevantDate']);
    /**
     * A list of iTunes Store item identifiers for the associated apps.
     * Only one item in the list is used—the first item identifier for an app
     * compatible with the current device.
     * If the app is not installed, the link opens the App Store and shows the app.
     * If the app is already installed, the link launches the app.
     */
    get associatedStoreIdentifiers(): ApplePass['associatedStoreIdentifiers'];
    set associatedStoreIdentifiers(v: ApplePass['associatedStoreIdentifiers']);
    /**
     * Brief description of the pass, used by the iOS accessibility technologies.
     * Don’t try to include all of the data on the pass in its description,
     * just include enough detail to distinguish passes of the same type.
     */
    get description(): string | undefined;
    set description(v: string | undefined);
    /**
     * Display name of the organization that originated and signed the pass.
     */
    get organizationName(): string | undefined;
    set organizationName(v: string | undefined);
    /**
     * Optional for event tickets and boarding passes; otherwise not allowed.
     * Identifier used to group related passes.
     * If a grouping identifier is specified, passes with the same style,
     * pass type identifier, and grouping identifier are displayed as a group.
     * Otherwise, passes are grouped automatically.
     * Use this to group passes that are tightly related,
     * such as the boarding passes for different connections of the same trip.
     */
    get groupingIdentifier(): string | undefined;
    set groupingIdentifier(v: string | undefined);
    /**
     * If true, the strip image is displayed without a shine effect.
     * The default value prior to iOS 7.0 is false.
     * In iOS 7.0, a shine effect is never applied, and this key is deprecated.
     */
    get suppressStripShine(): boolean;
    set suppressStripShine(v: boolean);
    /**
     * Text displayed next to the logo on the pass.
     */
    get logoText(): string | undefined;
    set logoText(v: string | undefined);
    /**
     * The URL of a web service that conforms to the API described in PassKit Web Service Reference.
     * The web service must use the HTTPS protocol in production; the leading https:// is included in the value of this key.
     * On devices configured for development, there is UI in Settings to allow HTTP web services. You can use the options
     * parameter to set allowHTTP to be able to use URLs that use the HTTP protocol.
     *
     * @see {@link https://developer.apple.com/library/archive/documentation/PassKit/Reference/PassKit_WebService/WebService.html#//apple_ref/doc/uid/TP40011988}
     */
    get webServiceURL(): URL | string | undefined;
    set webServiceURL(v: URL | string | undefined);
    /**
     * The authentication token to use with the web service.
     * The token must be 16 characters or longer.
     */
    get authenticationToken(): string | undefined;
    set authenticationToken(v: string | undefined);
    /**
     * Background color of the pass, specified as an CSS-style RGB triple.
     *
     * @example rgb(23, 187, 82)
     */
    get backgroundColor(): [number, number, number] | string | undefined | PassColor;
    set backgroundColor(v: string | [number, number, number] | undefined | PassColor);
    /**
     * Foreground color of the pass, specified as a CSS-style RGB triple.
     *
     * @example rgb(100, 10, 110)
     */
    get foregroundColor(): [number, number, number] | string | undefined | PassColor;
    set foregroundColor(v: string | [number, number, number] | PassColor | undefined);
    /**
     * Color of the label text, specified as a CSS-style RGB triple.
     *
     * @example rgb(255, 255, 255)
     */
    get labelColor(): [number, number, number] | string | undefined | PassColor;
    set labelColor(v: string | [number, number, number] | PassColor | undefined);
    /**
     * Color of the strip text, specified as a CSS-style RGB triple.
     *
     * @example rgb(255, 255, 255)
     */
    get stripColor(): [number, number, number] | string | undefined | PassColor;
    set stripColor(v: string | [number, number, number] | PassColor | undefined);
    /**
     * Maximum distance in meters from a relevant latitude and longitude that the pass is relevant.
     * This number is compared to the pass’s default distance and the smaller value is used.
     */
    get maxDistance(): number | undefined;
    set maxDistance(v: number | undefined);
    /**
     * Beacons marking locations where the pass is relevant.
     */
    get beacons(): ApplePass['beacons'];
    set beacons(v: ApplePass['beacons']);
    /**
     * Information specific to the pass’s barcode.
     * The system uses the first valid barcode dictionary in the array.
     * Additional dictionaries can be added as fallbacks.
     */
    get barcodes(): ApplePass['barcodes'];
    set barcodes(v: ApplePass['barcodes']);
    /**
     * Adds a location where a pass is relevant.
     *
     * @param {number[] | { lat: number, lng: number, alt?: number } | { longitude: number, latitude: number, altitude?: number }} point
     * @param {string} [relevantText]
     * @returns {this}
     */
    addLocation(point: number[] | {
        lat: number;
        lng: number;
        alt?: number;
    } | {
        longitude: number;
        latitude: number;
        altitude?: number;
    }, relevantText?: string): this;
    get locations(): ApplePass['locations'];
    set locations(v: ApplePass['locations']);
}
