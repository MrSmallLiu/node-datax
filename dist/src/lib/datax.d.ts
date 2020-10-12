import { Reader } from './reader';
import { Writer } from './writer';
import EE from '@antv/event-emitter';
export declare enum SyncState {
    reading = "reading",
    finish = "finish",
    error = "error"
}
export default class Datax extends EE {
    syncDataCount: number;
    constructor(reader: Reader, writer: Writer);
    start(reader: Reader, writer: Writer): Promise<void>;
}
