"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const etl_pg_1 = require("../lib/etl-pg");
const Cursor = require("pg-cursor");
// import 'Event' from ''
class PostgresReader {
    constructor(props) {
        this.db = props.db;
        this.tableName = props.tableName;
        this.column = props.column;
        this.batchSize = props.batchSize || 19;
        this.readState = etl_pg_1.SyncState.reading;
    }
    async init() {
        this.cursor = this.db.query(new Cursor(`select ${this.column.join(',')} from "${this.tableName}"`));
    }
    async read() {
        const result = { data: [], state: this.readState };
        if (this.readState === etl_pg_1.SyncState.finish) {
            return result;
        }
        const dataRes = await new Promise((resolve, reject) => {
            this.cursor.read(this.batchSize, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        }).catch(err => {
            this.readState = etl_pg_1.SyncState.error;
            result.msg = '读取失败';
            result.err = err;
        });
        if (dataRes !== undefined) {
            if (dataRes.length === 0) {
                this.readState = etl_pg_1.SyncState.finish;
            }
        }
        result.state = this.readState;
        result.data = dataRes;
        return result;
    }
}
exports.default = PostgresReader;
