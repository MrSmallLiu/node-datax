import { SyncState } from './datax';
export interface ReaderData {
    data: any[];
    state: SyncState;
    msg?: string;
    err?: any;
}
export interface Reader {
    init(): Promise<boolean>;
    read(): Promise<ReaderData>;
    close(): Promise<void>;
}
export interface ReaderCfg {
    db: any;
    tableName: string;
    column: string[];
    batchSize?: number;
    where?: string;
}
