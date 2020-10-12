import { Pool } from 'pg';
export default class Database {
    database: Pool;
    private retry;
    constructor(dbInfo: any);
    connect(): Promise<Pool>;
}
