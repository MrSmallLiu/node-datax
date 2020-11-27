"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datax_1 = require("../lib/datax");
// import * as Cursor from 'pg-cursor'
// import 'Event' from ''
class PostgresReader {
    constructor(props) {
        this.db = props.db;
        this.tableName = props.tableName;
        this.cursorName = `${props.tableName}_cursor`;
        this.column = props.column;
        this.where = props.where || '1=1';
        this.batchSize = props.batchSize || 20;
        this.readState = datax_1.SyncState.reading;
    }
    async init() {
        // await this.db.query('begin')
        await this.db.query('begin');
        this.cursorName = `${this.tableName}_cursor`;
        const cursorSql = `declare "${this.cursorName}" cursor for select ${this.column.join(',')} from "${this.tableName}" where ${this.where}`;
        const cursorRes = await this.db.query(cursorSql).catch(err => {
            console.error(new Error(err));
        });
        if (cursorRes === undefined) {
            this.db.query('rollback');
            this.readState = datax_1.SyncState.error;
            return false;
        }
        return true;
        // this.cursor = this.db.query(new Cursor(`select ${this.column.join(',')} from "${this.tableName}"`))
    }
    async read() {
        const result = { data: [], state: this.readState };
        if (this.readState === datax_1.SyncState.finish) {
            return result;
        }
        const dataSql = `fetch ${this.batchSize} from "${this.cursorName}"`;
        const dataRes = await this.db.query(dataSql).catch(err => {
            this.readState = datax_1.SyncState.error;
            result.msg = '读取失败';
            result.err = err;
            this.db.query('rollback');
        });
        if (dataRes === undefined) {
            return result;
        }
        if (dataRes.rows.length === 0) {
            this.readState = datax_1.SyncState.finish;
        }
        result.state = this.readState;
        result.data = dataRes.rows;
        return result;
    }
}
exports.default = PostgresReader;
//# sourceMappingURL=postgresreader.js.map