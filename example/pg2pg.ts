import { datax } from '../src'
(async function (): Promise<void> {
  const srcConnect = { host: '', username: 'postgres', password: '', database: '' }
  const destConnect = { host: '', username: 'postgres', password: '', database: '' }
  try {
    const etljcbcd = await datax(srcConnect, destConnect, { srcName: '', destName: '_copy1', column: ['*'] })
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
