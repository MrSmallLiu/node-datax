// import { Sequelize } from 'sequelize/types'
import { Reader, ReaderData, ReaderCfg } from '../lib/reader'
import { SyncState } from '../lib/datax'
import * as Cursor from 'pg-cursor'

// import 'Event' from ''

export default class PostgresReader implements Reader {
  public db: any;
  /** 是否开始读取 */
  public tableName: string
  public column: string[]
  private readState: SyncState
  private cursor: any
  public batchSize: number // 批量读取与写入的条数
  constructor (props: ReaderCfg) {
    this.db = props.db
    this.tableName = props.tableName
    this.column = props.column
    this.batchSize = props.batchSize || 19
    this.readState = SyncState.reading
  }

  async init (): Promise<void> {
    this.cursor = this.db.query(new Cursor(`select ${this.column.join(',')} from "${this.tableName}"`))
  }

  async read (): Promise<ReaderData> {
    const result: ReaderData = { data: [], state: this.readState }
    if (this.readState === SyncState.finish) {
      return result
    }
    const dataRes: any = await new Promise((resolve, reject) => {
      this.cursor.read(this.batchSize, (err, rows) => {
        if (err) {
          reject(err)
          return
        }
        resolve(rows)
      })
    }).catch(err => {
      this.readState = SyncState.error
      result.msg = '读取失败'
      result.err = err
    })

    if (dataRes !== undefined) {
      if (dataRes.length === 0) {
        this.readState = SyncState.finish
      }
    }
    result.state = this.readState
    result.data = dataRes
    return result
  }
}
