"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
(async function () {
    const srcConnect = { host: '172.16.111.3', username: 'postgres', password: 'geoc_sport', database: 'cth' };
    const destConnect = { host: '172.16.100.242', username: 'postgres', password: 'geoc_sport', database: 'data_test' };
    try {
        const etljcbcd = await src_1.default(srcConnect, destConnect, { srcName: 'jcb_cd_test', destName: 'jcb_cd', column: ['*'] });
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
