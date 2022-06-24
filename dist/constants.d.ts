/**
 * Common constants for fields names and values:
 * https://developer.apple.com/library/content/documentation/UserExperience/Reference/PassKit_Bundle/Chapters/LowerLevel.html#//apple_ref/doc/uid/TP40012026-CH3-SW3
 *
 */
import { PassStyle, TransitType, TextAlignment, NumberStyle, BarcodeFormat, DataStyleFormat, DataDetectors, PassCommonStructure, ApplePass } from './interfaces';
import { ImageType, ImageDensity } from './lib/images';
export declare const PASS_MIME_TYPE = "application/vnd.apple.pkpass";
export declare const TRANSIT: {
    AIR: TransitType;
    BOAT: TransitType;
    BUS: TransitType;
    TRAIN: TransitType;
    GENERIC: TransitType;
};
export declare const textDirection: {
    LEFT: TextAlignment;
    CENTER: TextAlignment;
    RIGHT: TextAlignment;
    NATURAL: TextAlignment;
};
export declare const barcodeFormat: {
    QR: BarcodeFormat;
    PDF417: BarcodeFormat;
    Aztec: BarcodeFormat;
    Code128: BarcodeFormat;
};
export declare const dateTimeFormat: {
    NONE: DataStyleFormat;
    SHORT: DataStyleFormat;
    MEDIUM: DataStyleFormat;
    LONG: DataStyleFormat;
    FULL: DataStyleFormat;
};
export declare const dataDetector: {
    PHONE: DataDetectors;
    LINK: DataDetectors;
    ADDRESS: DataDetectors;
    CALENDAR: DataDetectors;
};
export declare const numberStyle: {
    DECIMAL: NumberStyle;
    PERCENT: NumberStyle;
    SCIENTIFIC: NumberStyle;
    SPELL_OUT: NumberStyle;
};
/**
 * Supported images.
 */
export declare const IMAGES: {
    [k in ImageType]: {
        width: number;
        height: number;
        required?: boolean;
    };
};
export declare const DENSITIES: ReadonlySet<ImageDensity>;
export declare const PASS_STYLES: ReadonlySet<PassStyle>;
export declare const TOP_LEVEL_FIELDS: {
    [k in keyof ApplePass]?: {
        required?: boolean;
        type: 'string' | 'number' | typeof Array | typeof Boolean | typeof Object;
        templatable?: boolean;
        localizable?: boolean;
        minlength?: number;
    };
};
export declare const STRUCTURE_FIELDS: readonly (keyof PassCommonStructure)[];
export declare const BARCODES_FORMAT: ReadonlySet<BarcodeFormat>;
