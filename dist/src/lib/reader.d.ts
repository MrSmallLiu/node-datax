import { SyncState } from './etl-pg';
export interface ReaderData {
    data: any[];
    state: SyncState;
    msg?: string;
    err?: any;
}
export interface Reader {
    init(): Promise<void>;
    read(): Promise<ReaderData>;
}
export interface ReaderCfg {
    db: any;
    tableName: string;
    column: string[];
    batchSize?: number;
}
