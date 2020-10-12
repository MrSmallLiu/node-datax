"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncState = void 0;
const event_emitter_1 = require("@antv/event-emitter");
var SyncState;
(function (SyncState) {
    SyncState["reading"] = "reading";
    SyncState["finish"] = "finish";
    SyncState["error"] = "error";
})(SyncState = exports.SyncState || (exports.SyncState = {}));
class EtlPg extends event_emitter_1.default {
    constructor(reader, writer) {
        super();
        this.syncDataCount = 0;
        this.start(reader, writer);
    }
    async start(reader, writer) {
        await reader.init();
        let state = SyncState.reading;
        do {
            const readerData = await reader.read();
            state = readerData.state;
            if (state === SyncState.finish) {
                const result = { count: this.syncDataCount, msg: '完成数据同步' };
                this.emit('finish', result);
            }
            else if (state === SyncState.error) {
                const result = { count: this.syncDataCount, msg: readerData.msg, err: readerData.err };
                this.emit('error', result);
            }
            else {
                const writeRes = await writer.write(readerData.data).catch(err => {
                    state = SyncState.error;
                    const result = { count: this.syncDataCount, msg: '数据写入失败', err };
                    this.emit('error', result);
                });
                if (writeRes !== undefined) {
                    this.syncDataCount += readerData.data.length;
                    const result = { count: this.syncDataCount };
                    this.emit('data', result);
                }
            }
        } while (state === SyncState.reading);
    }
}
exports.default = EtlPg;
