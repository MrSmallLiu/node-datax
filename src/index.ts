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
  column: string[]; // 同步的字段
  staticColumn?: object; // 静态值的字段，有静态字段时column不可以为'*'。示例： { user_id: 1 } => 1 as user_id
  where?: string; // 查询数据时的where条件，不可以为 offset 1 limit 10。示例：' created_at > 2020-02-01 and user_id = 1'
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

export async function datax (srcConnectConfig: DbConnectConfig, destConnectConfig: DbConnectConfig, tableCfg: Config): Promise<Datax> {
  if (tableCfg.staticColumn && Object.keys(tableCfg.staticColumn).length > 0 && tableCfg.column.join(',') === '*') throw new Error('设置静态字段时，字段列不可以为\'*\'')
  // 连接数据库
  const srcConnectDB = new Database(srcConnectConfig)
  const srcClient = await srcConnectDB.connect()
  const destConnectDB = new Database(destConnectConfig)
  const destClient = await destConnectDB.connect()
  // for (const tableCfg of tables) {
  tableCfg.destName = tableCfg.destName || tableCfg.srcName
  const readerCfg: ReaderCfg = { db: srcClient, tableName: tableCfg.srcName, column: tableCfg.column, where: tableCfg.where }
  const reader = new PostgresReader(readerCfg)
  const writerCfg: WriterCfg = { db: destClient, tableName: tableCfg.destName, column: tableCfg.column, staticColumn: tableCfg.staticColumn }
  const writer = new PostgresWriter(writerCfg)
  return new Datax(reader, writer)
}
