export interface Writer{
  write(data): Promise<boolean>;
}
export interface WriterCfg {
  db: any;
  tableName: string;
  column: string[];
  staticColumn: object;
}
