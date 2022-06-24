/// <reference types="node" />
import * as forge from 'node-forge';
/**
 * Signs a manifest and returns the signature.
 *
 * @param {import('node-forge').pki.Certificate} certificate - signing certificate
 * @param {import('node-forge').pki.PrivateKey} key - certificate password
 * @param {string} manifest - manifest to sign
 * @returns {Buffer} - signature for given manifest
 */
export declare function signManifest(certificate: forge.pki.Certificate, key: forge.pki.PrivateKey, manifest: string): Buffer;
