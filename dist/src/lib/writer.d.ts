export interface Writer {
    write(data: any): Promise<boolean>;
}
export interface WriterCfg {
    db: any;
    tableName: string;
    column: string[];
    staticColumn: object;
}
