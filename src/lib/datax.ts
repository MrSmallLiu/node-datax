import { Reader } from './reader'
import { Writer } from './writer'
import EE from '@antv/event-emitter'
export enum SyncState{
  reading = 'reading',
  finish = 'finish',
  error = 'error',
}
interface DataxResult{
  count: number;
  msg?: string;
  err?: any;
}
export default class Datax extends EE {
  public syncDataCount: number
  constructor (reader: Reader, writer: Writer) {
    super()
    this.syncDataCount = 0
    this.start(reader, writer)
  }

  async start (reader: Reader, writer: Writer): Promise<void> {
    if (!await reader.init()) {
      const result: DataxResult = { count: this.syncDataCount, msg: '初始化失败' }
      this.emit('error', result)
      return
    }
    let state: SyncState = SyncState.reading
    do {
      const readerData = await reader.read()
      state = readerData.state
      if (state === SyncState.finish) {
        const result: DataxResult = { count: this.syncDataCount, msg: '完成数据同步' }
        this.emit('finish', result)
      } else if (state === SyncState.error) {
        const result: DataxResult = { count: this.syncDataCount, msg: readerData.msg, err: readerData.err }
        this.emit('error', result)
      } else {
        const writeRes = await writer.write(readerData.data).catch(err => {
          state = SyncState.error
          const result: DataxResult = { count: this.syncDataCount, msg: '数据写入失败', err }
          this.emit('error', result)
        })
        if (writeRes !== undefined) {
          this.syncDataCount += readerData.data.length
          const result: DataxResult = { count: this.syncDataCount }
          this.emit('data', result)
        }
      }
    } while (state === SyncState.reading)
  }
}
