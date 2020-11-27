export interface Writer {
    write(data: any): Promise<boolean>;
    close(): Promise<void>;
}
export interface WriterCfg {
    db: any;
    tableName: string;
    column: string[];
    staticColumn: object;
}
