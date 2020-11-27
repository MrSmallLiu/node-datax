"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
(async function () {
    const srcConnect = { host: '', username: 'postgres', password: '', database: '' };
    const destConnect = { host: '', username: 'postgres', password: '', database: '' };
    try {
        const etljcbcd = await src_1.datax(srcConnect, destConnect, { srcName: '', destName: '_copy1', column: ['*'] });
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
