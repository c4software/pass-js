/**
 * Passbook are created from templates
 */
/// <reference types="node" />
import * as http2 from 'http2';
import * as forge from 'node-forge';
import { Pass } from './pass';
import { PassStyle, ApplePass, Options } from './interfaces';
import { PassBase } from './lib/base-pass';
export declare class Template extends PassBase {
    key?: forge.pki.PrivateKey;
    certificate?: forge.pki.Certificate;
    private apn?;
    constructor(style?: PassStyle, fields?: Partial<ApplePass>, images?: import('./lib/images').PassImages, localization?: import('./lib/localizations').Localizations, options?: Options);
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
    static load(folderPath: string, keyPassword?: string, options?: Options): Promise<Template>;
    /**
   * Load template from a given buffer with ZIPped pass/template content
   *
   * @param {Buffer} buffer
   * @param {Options} options
   */
    static fromBuffer(buffer: Buffer, options?: Options): Promise<Template>;
    /**
     *
     * @param {string} signerKeyMessage
     * @param {string} [password]
     */
    setPrivateKey(signerKeyMessage: string, password?: string): void;
    /**
     *
     * @param {string} signerCertData - certificate and optional private key as PEM encoded string
     * @param {string} [password] - optional password to decode private key
     */
    setCertificate(signerCertData: string, password?: string): void;
    /**
     *
     * @param {string} signerPemFile - path to PEM file with certificate and private key
     * @param {string} password - private key decoding password
     */
    loadCertificate(signerPemFile: string, password?: string): Promise<void>;
    /**
     *
     * @param {string} pushToken
     */
    pushUpdates(pushToken: string): Promise<http2.IncomingHttpHeaders>;
    /**
     * Create a new pass from a template.
     *
     * @param {object} fields
     * @returns {Pass}
     * @memberof Template
     */
    createPass(fields?: Partial<ApplePass>): Pass;
}
