// import { Sequelize } from 'sequelize/types'
import { Reader, ReaderData, ReaderCfg } from '../lib/reader'
import { SyncState } from '../lib/datax'
// import * as Cursor from 'pg-cursor'

// import 'Event' from ''

export default class PostgresReader implements Reader {
  public db: any;
  /** 是否开始读取 */
  public tableName: string
  public column: string[]
  private readState: SyncState
  // private cursor: any
  public where: string
  private cursorName: string
  public batchSize: number // 批量读取与写入的条数
  constructor (props: ReaderCfg) {
    this.db = props.db
    this.tableName = props.tableName
    this.cursorName = `${props.tableName}_cursor`
    this.column = props.column
    this.where = props.where || '1=1'
    this.batchSize = props.batchSize || 20
    this.readState = SyncState.reading
  }

  async init (): Promise<boolean> {
    // await this.db.query('begin')
    await this.db.query('begin')
    this.cursorName = `${this.tableName}_cursor`
    const cursorSql = `declare "${this.cursorName}" cursor for select ${this.column.join(',')} from "${this.tableName}" where ${this.where}`
    const cursorRes = await this.db.query(cursorSql).catch(err => {
      console.error(new Error(err))
    })
    if (cursorRes === undefined) {
      this.db.query('rollback')
      this.readState = SyncState.error
      return false
    }
    return true
    // this.cursor = this.db.query(new Cursor(`select ${this.column.join(',')} from "${this.tableName}"`))
  }

  async read (): Promise<ReaderData> {
    const result: ReaderData = { data: [], state: this.readState }
    if (this.readState === SyncState.finish) {
      return result
    }
    const dataSql = `fetch ${this.batchSize} from "${this.cursorName}"`
    const dataRes = await this.db.query(dataSql).catch(err => {
      this.readState = SyncState.error
      result.msg = '读取失败'
      result.err = err
    })
    if (dataRes === undefined) {
      await this.db.query('rollback')
      return result
    }
    if (dataRes.rows.length === 0) {
      this.readState = SyncState.finish
      await this.db.query('commit')
    }
    result.state = this.readState
    result.data = dataRes.rows
    return result
  }

  async close (): Promise<void> {
    await this.db.end()
  }
}
