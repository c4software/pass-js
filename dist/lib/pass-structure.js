"use strict";
/* eslint-disable max-depth */
/**
 * Class that implements base structure fields setters / getters
 *
 * @see {@link https://developer.apple.com/library/content/documentation/UserExperience/Reference/PassKit_Bundle/Chapters/LowerLevel.html#//apple_ref/doc/uid/TP40012026-CH3-SW3}
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassStructure = void 0;
const constants_1 = require("../constants");
const fieldsMap_1 = require("./fieldsMap");
const nfc_fields_1 = require("./nfc-fields");
class PassStructure {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    constructor(fields = {}) {
        this.fields = {};
        // setting style first
        for (const style of constants_1.PASS_STYLES) {
            if (style in fields) {
                this.style = style;
                if ('boardingPass' in fields && fields.boardingPass) {
                    this.transitType = fields.boardingPass.transitType;
                }
                else if ('nfc' in fields) {
                    // check NFC fields
                    this.fields.nfc = new nfc_fields_1.NFCField(fields.nfc);
                }
                const structure = fields[this.style];
                for (const prop of constants_1.STRUCTURE_FIELDS) {
                    if (prop in structure) {
                        const currentProperty = structure[prop];
                        if (Array.isArray(currentProperty))
                            for (const field of currentProperty)
                                this[prop].add(field);
                        else if (currentProperty instanceof fieldsMap_1.FieldsMap)
                            // copy fields
                            for (const [key, data] of currentProperty)
                                this[prop].add({ key, ...data });
                    }
                }
            }
        }
    }
    /**
     * Pass type, e.g boardingPass, coupon, etc
     */
    get style() {
        for (const style of constants_1.PASS_STYLES) {
            if (style in this.fields)
                return style;
        }
        return undefined;
    }
    set style(v) {
        // remove all other styles
        for (const style of constants_1.PASS_STYLES)
            if (style !== v)
                delete this.fields[style];
        if (!v)
            return;
        if (!constants_1.PASS_STYLES.has(v))
            throw new TypeError(`Invalid Pass type "${v}"`);
        if (!(v in this.fields))
            this.fields[v] = {};
        // Add NFC fields
        this.fields.nfc = new nfc_fields_1.NFCField();
        //   if ('boardingPass' in this.fields && this.fields.boardingPass) this.fields.boardingPass.
    }
    /**
     * Required for boarding passes; otherwise not allowed.
     * Type of transit.
     * Must be one of the following values: PKTransitTypeAir, PKTransitTypeBoat, PKTransitTypeBus, PKTransitTypeGeneric,PKTransitTypeTrain.
     */
    get transitType() {
        if (this.style !== 'boardingPass')
            throw new ReferenceError(`transitType field only allowed in Boarding Passes, current pass is ${this.style}`);
        if ('boardingPass' in this.fields && this.fields.boardingPass)
            return this.fields.boardingPass.transitType;
        return undefined;
    }
    set transitType(v) {
        const { style } = this;
        if (!style) {
            // removing transitType on empty pass does nothing
            if (!v)
                return;
            // setting transitStyle on a pass without type will set this pass as boardingPass also
            this.style = 'boardingPass';
        }
        if (!('boardingPass' in this.fields))
            throw new ReferenceError(`transitType field is only allowed at boarding passes`);
        if (!v) {
            if (this.fields.boardingPass)
                delete this.fields.boardingPass.transitType;
        }
        else {
            if (Object.values(constants_1.TRANSIT).includes(v)) {
                if (this.fields.boardingPass)
                    this.fields.boardingPass.transitType = v;
                else
                    this.fields.boardingPass = { transitType: v };
            }
            else
                throw new TypeError(`Unknown transit type "${v}"`);
        }
    }
    /**
     * NFC-enabled pass keys support sending reward card information as part of an Apple Pay transaction.
     *
     * NFC-enabled pass keys are only supported in passes that contain an Enhanced Passbook/NFC certificate.
     * For more information, contact merchant support at https://developer.apple.com/contact/passkit/.
     *
     * @see {@link https://developer.apple.com/library/archive/documentation/UserExperience/Reference/PassKit_Bundle/Chapters/TopLevel.html#//apple_ref/doc/uid/TP40012026-CH2-DontLinkElementID_3}
     */
    get nfc() {
        return this.fields.nfc;
    }
    get headerFields() {
        const { style } = this;
        if (!style)
            throw new ReferenceError(`Pass style is undefined, set the pass style before accessing pass structure fields`);
        if (!(this.fields[style].headerFields instanceof fieldsMap_1.FieldsMap))
            this.fields[style].headerFields = new fieldsMap_1.FieldsMap();
        return this.fields[style].headerFields;
    }
    get auxiliaryFields() {
        const { style } = this;
        if (!style)
            throw new ReferenceError(`Pass style is undefined, set the pass style before accessing pass structure fields`);
        if (!(this.fields[style].auxiliaryFields instanceof fieldsMap_1.FieldsMap))
            this.fields[style].auxiliaryFields = new fieldsMap_1.FieldsMap();
        return this.fields[style].auxiliaryFields;
    }
    get backFields() {
        const { style } = this;
        if (!style)
            throw new ReferenceError(`Pass style is undefined, set the pass style before accessing pass structure fields`);
        if (!(this.fields[style].backFields instanceof fieldsMap_1.FieldsMap))
            this.fields[style].backFields = new fieldsMap_1.FieldsMap();
        return this.fields[style].backFields;
    }
    get primaryFields() {
        const { style } = this;
        if (!style)
            throw new ReferenceError(`Pass style is undefined, set the pass style before accessing pass structure fields`);
        if (!(this.fields[style].primaryFields instanceof fieldsMap_1.FieldsMap))
            this.fields[style].primaryFields = new fieldsMap_1.FieldsMap();
        return this.fields[style].primaryFields;
    }
    get secondaryFields() {
        const { style } = this;
        if (!style)
            throw new ReferenceError(`Pass style is undefined, set the pass style before accessing pass structure fields`);
        if (!(this.fields[style].secondaryFields instanceof fieldsMap_1.FieldsMap))
            this.fields[style].secondaryFields = new fieldsMap_1.FieldsMap();
        return this.fields[style].secondaryFields;
    }
}
exports.PassStructure = PassStructure;
//# sourceMappingURL=pass-structure.js.map