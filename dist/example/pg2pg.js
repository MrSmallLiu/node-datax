"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
(async function () {
    const srcConnect = { host: '172.16.111.3', username: 'postgres', password: 'geoc_sport', database: 'test' };
    const destConnect = { host: '172.16.111.3', username: 'postgres', password: 'geoc_sport', database: 'test' };
    try {
        const etljcbcd = await src_1.datax(srcConnect, destConnect, { srcName: 'test', destName: 'test1', where: 'data_id = 1', column: ['data_id', 'name'], staticColumn: { user_id: '111', updated_at: 'now()' } });
        etljcbcd.on('finish', (res) => {
            console.log('finish');
        });
        etljcbcd.on('error', (res) => {
            console.log('error');
        });
        etljcbcd.on('data', (res) => {
            console.log('完成条数：', res.count);
        });
    }
    catch (error) {
        console.log('初始化失败');
    }
})();
//# sourceMappingURL=pg2pg.js.map