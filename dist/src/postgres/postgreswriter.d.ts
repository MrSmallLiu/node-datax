import { Writer, WriterCfg } from '../lib/writer';
export default class PostgresWriter implements Writer {
    db: any;
    /** 是否开始读取 */
    tableName: string;
    column: string[];
    staticColumn: object;
    constructor(props: WriterCfg);
    write(data: any[]): Promise<boolean>;
}
