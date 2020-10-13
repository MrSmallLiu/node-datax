import { Reader, ReaderData, ReaderCfg } from '../lib/reader';
export default class PostgresReader implements Reader {
    db: any;
    /** 是否开始读取 */
    tableName: string;
    column: string[];
    private readState;
    private cursor;
    private cursorName;
    batchSize: number;
    constructor(props: ReaderCfg);
    init(): Promise<boolean>;
    read(): Promise<ReaderData>;
}
