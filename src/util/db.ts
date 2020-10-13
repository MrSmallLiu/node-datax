// import { Sequelize } from 'sequelize'
// import { Options } from 'sequelize/types'
import { Pool } from 'pg'
export default class Database {
  database: Pool;
  private retry = 0;
  constructor (dbInfo: any) {
    this.database = new Pool({
      host: dbInfo.host,
      user: dbInfo.username,
      database: dbInfo.database,
      password: dbInfo.password,
      max: 3,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 100000
    })
  }

  async connect (): Promise<Pool> {
    try {
      const client = await this.database.connect()
      return client
    } catch (e) {
      if (this.retry >= 3) throw new Error(e)
      this.retry += 1
      console.warn(`Db Connect Error: ${e.message}, sleep 1 seconds to retry...`)
      await new Promise(resolve => {
        setTimeout(function () {
          resolve()
        }, 1000)
      })
      await this.connect()
    }
  }
}
