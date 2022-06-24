/// <reference types="node" />
import { Entry, Options, ZipFile } from 'yauzl';
export declare const unzipBuffer: (buffer: Buffer, options?: Options | undefined) => Promise<ZipFile & {
    openReadStreamAsync: (v: Entry) => Promise<import('stream').Readable>;
    getBuffer: (entry: Entry) => Promise<Buffer>;
    [Symbol.asyncIterator](): AsyncIterator<Entry>;
}>;
