"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datax = void 0;
// import { Options } from 'sequelize/types'
const db_1 = require("./util/db");
const datax_1 = require("./lib/datax");
const postgresreader_1 = require("./postgres/postgresreader");
const postgreswriter_1 = require("./postgres/postgreswriter");
async function datax(srcConnectConfig, destConnectConfig, tableCfg) {
    if (tableCfg.staticColumn && Object.keys(tableCfg.staticColumn).length > 0 && tableCfg.column.join(',') === '*')
        throw new Error('设置静态字段时，字段列不可以为\'*\'');
    // 连接数据库
    const srcConnectDB = new db_1.default(srcConnectConfig);
    const srcClient = await srcConnectDB.connect();
    const destConnectDB = new db_1.default(destConnectConfig);
    const destClient = await destConnectDB.connect();
    // for (const tableCfg of tables) {
    tableCfg.destName = tableCfg.destName || tableCfg.srcName;
    const readerCfg = { db: srcClient, tableName: tableCfg.srcName, column: tableCfg.column, where: tableCfg.where };
    const reader = new postgresreader_1.default(readerCfg);
    const writerCfg = { db: destClient, tableName: tableCfg.destName, column: tableCfg.column, staticColumn: tableCfg.staticColumn };
    const writer = new postgreswriter_1.default(writerCfg);
    return new datax_1.default(reader, writer);
}
exports.datax = datax;
