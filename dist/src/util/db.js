"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Sequelize } from 'sequelize'
// import { Options } from 'sequelize/types'
const pg_1 = require("pg");
class Database {
    constructor(dbInfo) {
        this.retry = 0;
        this.database = new pg_1.Pool({
            host: dbInfo.host,
            user: dbInfo.username,
            database: dbInfo.database,
            password: dbInfo.password,
            max: 3,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000
        });
    }
    async connect() {
        try {
            const client = await this.database.connect();
            return client;
        }
        catch (e) {
            if (this.retry >= 3)
                throw new Error(e);
            this.retry += 1;
            console.warn(`Db Connect Error: ${e.message}, sleep 1 seconds to retry...`);
            await new Promise(resolve => {
                setTimeout(function () {
                    resolve();
                }, 1000);
            });
            await this.connect();
        }
    }
}
exports.default = Database;
