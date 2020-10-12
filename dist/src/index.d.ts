import Datax from './lib/datax';
/**
 * 同步的表配置
 */
interface Config {
    srcName: string;
    destName?: string;
    column: string[];
    batchSize?: number;
    create?: boolean;
    clean?: boolean;
}
interface DbConnectConfig {
    host: string;
    username: string;
    password: string;
    database: string;
    port?: number;
}
export declare function datax(srcConnectConfig: DbConnectConfig, destConnectConfig: DbConnectConfig, tableCfg: Config): Promise<Datax>;
export {};
