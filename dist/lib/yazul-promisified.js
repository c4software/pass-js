"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.unzipBuffer = void 0;
const util_1 = require("util");
const yauzl_1 = require("yauzl");
const event_iterator_1 = require("event-iterator");
const stream_to_buffer_1 = require("./stream-to-buffer");
// Promisifying yauzl
Object.defineProperties(yauzl_1.ZipFile.prototype, {
    [Symbol.asyncIterator]: {
        enumerable: true,
        writable: false,
        configurable: false,
        value() {
            return new event_iterator_1.EventIterator((push, stop, fail) => {
                this.addListener('entry', push);
                this.addListener('end', stop);
                this.addListener('error', fail);
            })[Symbol.asyncIterator]();
        },
    },
    openReadStreamAsync: {
        enumerable: true,
        writable: false,
        configurable: false,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        value: (0, util_1.promisify)(yauzl_1.ZipFile.prototype.openReadStream),
    },
    getBuffer: {
        enumerable: true,
        writable: false,
        configurable: false,
        async value(entry) {
            const stream = await this.openReadStreamAsync(entry);
            return (0, stream_to_buffer_1.streamToBuffer)(stream);
        },
    },
});
exports.unzipBuffer = (0, util_1.promisify)(yauzl_1.fromBuffer);
//# sourceMappingURL=yazul-promisified.js.map