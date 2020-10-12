import EtlPg from './lib/etl-pg';
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
export default function etl(srcConnectConfig: DbConnectConfig, destConnectConfig: DbConnectConfig, tableCfg: Config): Promise<EtlPg>;
export {};
