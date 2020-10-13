# node-datax

使用TypeScript开发的Node的数据提取工具
## 安装
> `$ npm install node-datax `
## 使用
```javascript
  const { datax } = require('node-datax');
  const srcConnect = { host: '', username: 'postgres', password: '', database: '' }
  const destConnect = { host: '', username: 'postgres', password: '', database: '' }
  try {
    const datax1 = await datax(srcConnect, destConnect, { srcName: 'jcb_cd_test', destName: 'jcb_cd', column: ['*'] })
    datax1.on('finish', (res) => {
      console.log('总条数：', res.count)
      console.log('finish')
    })
    datax1.on('error', (res) => {
      console.log('error')
    })
    datax1.on('data', (res) => {
      console.log('完成条数：', res.count)
    })
  } catch (error) {
    console.log('初始化失败')
  }

```
### 开发
1. 修改`tsconfig.json`中`sourceMap`为`false`
2. 执行 `npm run build`命令

