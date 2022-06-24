import * as forge from 'node-forge';
import { NFCDictionary } from '../interfaces';
/**
 * node-forge doesn't support ECDH used by Apple in NFC,
 * so we will store keys as PEM encoded strings
 *
 * @see {@link https://github.com/digitalbazaar/forge/issues/116}
 * @see {@link https://stackoverflow.com/questions/48438753/apple-wallet-nfc-encryptionpublickey}
 * @see {@link https://github.com/digitalbazaar/forge/issues/237}
 */
export declare class NFCField implements NFCDictionary {
    message: string;
    encryptionPublicKey?: string;
    /**
     *
     */
    constructor(nfc?: NFCDictionary);
    /**
     * Sets public key from PEM-encoded key or forge.pki.PublicKey instance
     *
     * @param {forge.pki.PublicKey | string} key
     * @returns {this}
     */
    setPublicKey(key: forge.pki.PublicKey | string): this;
    toJSON(): NFCDictionary | undefined;
}
