import { datax } from '../src'
(async function (): Promise<void> {
  const srcConnect = { host: '', username: 'postgres', password: '', database: 'test' }
  const destConnect = { host: '', username: 'postgres', password: '', database: 'test' }
  try {
    const etljcbcd = await datax(srcConnect, destConnect, { srcName: 'test', destName: 'test1', where: 'data_id = 1', column: ['data_id', 'name'], staticColumn: { user_id: '111', updated_at: 'now()' } })
    etljcbcd.on('finish', (res) => {
      console.log('finish')
    })
    etljcbcd.on('error', (res) => {
      console.log('error')
    })
    etljcbcd.on('data', (res) => {
      console.log('完成条数：', res.count)
    })
  } catch (error) {
    console.log('初始化失败')
  }
})()
