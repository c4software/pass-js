/// <reference types="node" />
import { Readable } from 'stream';
/**
 *  Converts readableStream into a Buffer
 *
 * @param {Readable} readableStream
 * @returns {Promise<Buffer>}
 */
export declare function streamToBuffer(readableStream: Readable): Promise<Buffer>;
