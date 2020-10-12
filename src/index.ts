// import { Options } from 'sequelize/types'
import Database from './util/db'
import Datax from './lib/datax'
import { ReaderCfg } from './lib/reader'
import { WriterCfg } from './lib/writer'
import PostgresReader from './postgres/postgresreader'
import PostgresWriter from './postgres/postgreswriter'
/**
 * 同步的表配置
 */
interface Config {
  srcName: string; // 表名
  destName?: string; // 导到目标库的表名
  column: string[];
  batchSize?: number; // 批次读取与写入的条数，默认20
  create?: boolean; // 表不存在时是否创建该表
  clean?: boolean; // 表存在时是否清空数据（delete）
}
interface DbConnectConfig{
  host: string;
  username: string;
  password: string;
  database: string;
  port?: number;
}

export default async function datax (srcConnectConfig: DbConnectConfig, destConnectConfig: DbConnectConfig, tableCfg: Config): Promise<Datax> {
  // console.log(tables);
  // 连接数据库
  const srcConnectDB = new Database(srcConnectConfig)
  const srcClient = await srcConnectDB.connect()
  const destConnectDB = new Database(destConnectConfig)
  const destClient = await destConnectDB.connect()
  // for (const tableCfg of tables) {
  tableCfg.destName = tableCfg.destName || tableCfg.srcName
  const readerCfg: ReaderCfg = { db: srcClient, tableName: tableCfg.srcName, column: tableCfg.column }
  const reader = new PostgresReader(readerCfg)
  const writerCfg: WriterCfg = { db: destClient, tableName: tableCfg.destName, column: tableCfg.column }
  const writer = new PostgresWriter(writerCfg)
  return new Datax(reader, writer)
}
