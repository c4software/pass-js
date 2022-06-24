"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamToBuffer = void 0;
/**
 *  Converts readableStream into a Buffer
 *
 * @param {Readable} readableStream
 * @returns {Promise<Buffer>}
 */
async function streamToBuffer(readableStream) {
    const buf = [];
    for await (const data of readableStream) {
        buf.push(data);
    }
    return Buffer.concat(buf);
}
exports.streamToBuffer = streamToBuffer;
//# sourceMappingURL=stream-to-buffer.js.map