/**
 * Passbook are created from templates
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
const http2 = require("http2");
const path_1 = require("path");
const fs_1 = require("fs");
const forge = require("node-forge");
const buffer_crc32_1 = require("buffer-crc32");
const pass_1 = require("./pass");
const constants_1 = require("./constants");
const base_pass_1 = require("./lib/base-pass");
const yazul_promisified_1 = require("./lib/yazul-promisified");
const strip_json_comments_1 = require("strip-json-comments");
const { HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, NGHTTP2_CANCEL, HTTP2_METHOD_POST, } = http2.constants;
const { readFile, readdir } = fs_1.promises;
// Create a new template.
//
// style  - Pass style (coupon, eventTicket, etc)
// fields - Pass fields (passTypeIdentifier, teamIdentifier, etc)
class Template extends base_pass_1.PassBase {
    // eslint-disable-next-line max-params
    constructor(style, fields = {}, images, localization, options) {
        super(fields, images, localization, options);
        if (style) {
            if (!constants_1.PASS_STYLES.has(style))
                throw new TypeError(`Unsupported pass style ${style}`);
            this.style = style;
        }
    }
    /**
   * Loads Template, images and key from a given path
   *
   * @static
   * @param {string} folderPath
   * @param {string} [keyPassword] - optional key password
   * @param {Options} options - settings for the lib
   * @returns {Promise.<Template>}
   * @throws - if given folder doesn't contain pass.json or it is in invalid format
   * @memberof Template
   */
    // eslint-disable-next-line max-statements, sonarjs/cognitive-complexity
    static async load(folderPath, keyPassword, options) {
        // Check if the path is accessible directory actually
        const entries = await readdir(folderPath, { withFileTypes: true });
        // getting main JSON file
        let template;
        // read pass.json first to create template instance
        if (entries.find(entry => entry.isFile() && entry.name === 'pass.json')) {
            // loading main JSON file
            const jsonContent = await readFile((0, path_1.join)(folderPath, 'pass.json'), 'utf8');
            const passJson = JSON.parse((0, strip_json_comments_1.default)(jsonContent));
            // Trying to detect the type of pass
            let type;
            for (const t of constants_1.PASS_STYLES) {
                if (t in passJson) {
                    type = t;
                    break;
                }
            }
            if (!type)
                throw new TypeError('Unknown pass style!');
            template = new Template(type, passJson, undefined, undefined, options);
        }
        else
            template = createDefaultTemplate(options);
        const { passTypeIdentifier } = template;
        const keyName = passTypeIdentifier
            ? `${passTypeIdentifier.replace(/^pass\./, '')}.pem`
            : undefined;
        // checking rest of files
        const entriesLoader = [];
        for (const entry of entries) {
            if (entry.isDirectory()) {
                // check if it's a localization folder
                const test = /(?<lang>[-A-Z_a-z]+)\.lproj/.exec(entry.name);
                if (!test || !test.groups || !test.groups.lang)
                    continue;
                const { lang } = test.groups;
                // reading this directory
                const currentPath = (0, path_1.join)(folderPath, entry.name);
                const localizations = await readdir(currentPath, {
                    withFileTypes: true,
                });
                // check if it has strings and load
                if (localizations.find(f => f.isFile() && f.name === 'pass.strings'))
                    entriesLoader.push(template.localization.addFile(lang, (0, path_1.join)(currentPath, 'pass.strings')));
                // check if we have any localized images
                for (const f of localizations) {
                    const img = template.images.parseFilename(f.name);
                    if (img)
                        entriesLoader.push(template.images.add(img.imageType, (0, path_1.join)(currentPath, f.name), img.density, lang));
                }
            }
            else {
                // check if it's a certificate/key
                if (entry.name === keyName) {
                    // following will throw if file doesn't exists or can't be read
                    entriesLoader.push(template.loadCertificate((0, path_1.join)(folderPath, keyName), keyPassword));
                    continue;
                }
                // check it it's an image
                const img = template.images.parseFilename(entry.name);
                if (img)
                    entriesLoader.push(template.images.add(img.imageType, (0, path_1.join)(folderPath, entry.name), img.density));
            }
        }
        await Promise.all(entriesLoader);
        // done
        return template;
    }
    /**
   * Load template from a given buffer with ZIPped pass/template content
   *
   * @param {Buffer} buffer
   * @param {Options} options
   */
    static async fromBuffer(buffer, options) {
        var _a;
        const zip = await (0, yazul_promisified_1.unzipBuffer)(buffer);
        if (zip.entryCount < 1)
            throw new TypeError(`Provided ZIP buffer contains no entries`);
        let template = createDefaultTemplate(options);
        for await (const entry of zip) {
            if (entry.fileName.endsWith('/'))
                continue;
            if (/\/?pass\.json$/i.test(entry.fileName)) {
                if (template.style)
                    throw new TypeError(`Archive contains more than one pass.json - found ${entry.fileName}`);
                const buf = await zip.getBuffer(entry);
                if ((0, buffer_crc32_1.unsigned)(buf) !== entry.crc32)
                    throw new Error(`CRC32 does not match for ${entry.fileName}, expected ${entry.crc32}, got ${(0, buffer_crc32_1.unsigned)(buf)}`);
                const passJSON = JSON.parse((0, strip_json_comments_1.default)(buf.toString('utf8')));
                template = new Template(undefined, passJSON, template.images, template.localization, options);
            }
            else {
                // test if it's an image
                const img = template.images.parseFilename(entry.fileName);
                if (img) {
                    const imgBuffer = await zip.getBuffer(entry);
                    if ((0, buffer_crc32_1.unsigned)(imgBuffer) !== entry.crc32)
                        throw new Error(`CRC32 does not match for ${entry.fileName}, expected ${entry.crc32}, got ${(0, buffer_crc32_1.unsigned)(imgBuffer)}`);
                    await template.images.add(img.imageType, imgBuffer, img.density, img.lang);
                }
                else {
                    // the only option lest is 'pass.strings' file in localization folder
                    const test = /(^|\/)(?<lang>[-_a-z]+)\.lproj\/pass\.strings$/i.exec(entry.fileName);
                    if ((_a = test === null || test === void 0 ? void 0 : test.groups) === null || _a === void 0 ? void 0 : _a.lang) {
                        // found a localization file
                        const stream = await zip.openReadStreamAsync(entry);
                        await template.localization.addFromStream(test.groups.lang, stream);
                    }
                }
            }
        }
        return template;
    }
    /**
     *
     * @param {string} signerKeyMessage
     * @param {string} [password]
     */
    setPrivateKey(signerKeyMessage, password) {
        this.key = forge.pki.decryptRsaPrivateKey(signerKeyMessage, password);
        if (!this.key)
            throw new Error('Failed to decode provided private key. Invalid password?');
    }
    /**
     *
     * @param {string} signerCertData - certificate and optional private key as PEM encoded string
     * @param {string} [password] - optional password to decode private key
     */
    setCertificate(signerCertData, password) {
        // the PEM file from P12 contains both, certificate and private key
        // getting signer certificate
        this.certificate = forge.pki.certificateFromPem(signerCertData);
        if (!this.certificate)
            throw new Error('Failed to decode provided certificate');
        // check if signerCertData also contains private key and use it
        const pemMessages = forge.pem.decode(signerCertData);
        // getting signer private key
        const signerKeyMessage = pemMessages.find(message => message.type.includes('KEY'));
        if (signerKeyMessage)
            this.setPrivateKey(forge.pem.encode(signerKeyMessage), password);
    }
    /**
     *
     * @param {string} signerPemFile - path to PEM file with certificate and private key
     * @param {string} password - private key decoding password
     */
    async loadCertificate(signerPemFile, password) {
        // reading and parsing certificates
        const signerCertData = await readFile(signerPemFile, 'utf8');
        this.setCertificate(signerCertData, password);
    }
    /**
     *
     * @param {string} pushToken
     */
    async pushUpdates(pushToken) {
        // https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/PassKit_PG/Updating.html
        if (!this.apn || this.apn.destroyed) {
            // creating APN Provider
            await new Promise((resolve, reject) => {
                if (!this.key)
                    throw new ReferenceError(`Set private key before trying to push pass updates`);
                if (!this.certificate)
                    throw new ReferenceError(`Set pass certificate before trying to push pass updates`);
                const apn = http2.connect('https://api.push.apple.com:443', {
                    key: forge.pki.privateKeyToPem(this.key),
                    cert: forge.pki.certificateToPem(this.certificate),
                });
                // Calling unref() on a socket will allow the program to exit if this is the only active socket in the event system
                apn.unref();
                // Events
                apn
                    .once('goaway', () => {
                    if (this.apn && !this.apn.destroyed)
                        this.apn.destroy();
                })
                    .once('error', reject)
                    .once('connect', () => {
                    if (apn.destroyed)
                        throw new Error('APN was destroyed before connecting');
                    this.apn = apn;
                    resolve(true);
                });
            });
        }
        // sending to APN
        return new Promise((resolve, reject) => {
            if (!this.apn || this.apn.destroyed)
                throw new Error('APN was destroyed before connecting');
            const req = this.apn.request({
                [HTTP2_HEADER_METHOD]: HTTP2_METHOD_POST,
                [HTTP2_HEADER_PATH]: `/3/device/${encodeURIComponent(pushToken)}`,
            });
            // Cancel request after timeout
            req.setTimeout(5000, () => {
                req.close(NGHTTP2_CANCEL, () => reject(new Error(`http2: timeout connecting to api.push.apple.com`)));
            });
            // Error handling
            req.once('error', reject);
            // Wait for response before resolving
            req.once('response', resolve);
            // Post payload (always empty in our case)
            req.end('{}');
        });
    }
    /**
     * Create a new pass from a template.
     *
     * @param {object} fields
     * @returns {Pass}
     * @memberof Template
     */
    createPass(fields = {}) {
        // Combine template and pass fields
        return new pass_1.Pass(this, { ...this.fields, ...fields }, this.images, this.localization, this.options);
    }
}
exports.Template = Template;
function createDefaultTemplate(options) {
    return new Template(undefined, {}, undefined, undefined, options);
}
//# sourceMappingURL=template.js.map