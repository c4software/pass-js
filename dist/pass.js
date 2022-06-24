// Generate a pass file.
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pass = void 0;
const do_not_zip_1 = require("do-not-zip");
const getBufferHash_1 = require("./lib/getBufferHash");
const signManifest_forge_1 = require("./lib/signManifest-forge");
const base_pass_1 = require("./lib/base-pass");
// Create a new pass.
//
// template  - The template
// fields    - Pass fields (description, serialNumber, logoText)
class Pass extends base_pass_1.PassBase {
    // eslint-disable-next-line max-params
    constructor(template, fields = {}, images, localization, options) {
        super(fields, images, localization, options);
        this.template = template;
        Object.preventExtensions(this);
    }
    // Validate pass, throws error if missing a mandatory top-level field or image.
    validate() {
        // Check required top level fields
        for (const requiredField of [
            'description',
            'organizationName',
            'passTypeIdentifier',
            'serialNumber',
            'teamIdentifier',
        ])
            if (!(requiredField in this.fields))
                throw new ReferenceError(`${requiredField} is required in a Pass`);
        // authenticationToken && webServiceURL must be either both or none
        if ('webServiceURL' in this.fields) {
            if (typeof this.fields.authenticationToken !== 'string')
                throw new Error('While webServiceURL is present, authenticationToken also required!');
            if (this.fields.authenticationToken.length < 16)
                throw new ReferenceError('authenticationToken must be at least 16 characters long!');
        }
        else if ('authenticationToken' in this.fields)
            throw new TypeError('authenticationToken is presented in Pass data while webServiceURL is missing!');
        this.images.validate();
    }
    /**
     * Returns Pass as a Buffer
     *
     * @memberof Pass
     * @returns {Promise.<Buffer>}
     */
    async asBuffer() {
        // Validate before attempting to create
        this.validate();
        if (!this.template.certificate)
            throw new ReferenceError(`Set pass certificate in template before producing pass buffers`);
        if (!this.template.key)
            throw new ReferenceError(`Set private key in pass template before producing pass buffers`);
        // Creating new Zip file
        const zip = [];
        // Adding required files
        // Create pass.json
        zip.push({ path: 'pass.json', data: Buffer.from(JSON.stringify(this)) });
        // Localization
        zip.push(...this.localization.toArray());
        // Images
        zip.push(...(await this.images.toArray()));
        // adding manifest
        // Construct manifest here
        const manifestJson = JSON.stringify(zip.reduce((res, { path, data }) => {
            res[path] = (0, getBufferHash_1.getBufferHash)(data);
            return res;
        }, {}));
        zip.push({ path: 'manifest.json', data: manifestJson });
        // Create signature
        const signature = (0, signManifest_forge_1.signManifest)(this.template.certificate, this.template.key, manifestJson);
        zip.push({ path: 'signature', data: signature });
        // finished!
        return (0, do_not_zip_1.toBuffer)(zip);
    }
}
exports.Pass = Pass;
//# sourceMappingURL=pass.js.map