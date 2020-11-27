"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PostgresWriter {
    constructor(props) {
        this.db = props.db;
        this.tableName = props.tableName;
        this.column = [...props.column];
        this.staticColumn = props.staticColumn || {};
        // 将静态字段添加到column中
        for (const columnKey in this.staticColumn) {
            this.column.push(columnKey);
        }
    }
    async write(data) {
        // console.log('写入')
        // const result = true
        const sqlValues = [];
        for (const tempData of data) {
            const values = [];
            // 临时数据中插入静态字段数据
            for (const key in this.staticColumn) {
                tempData[key] = this.staticColumn[key];
            }
            for (const field in tempData) {
                if (tempData[field] === null) {
                    values.push('NULl');
                }
                else if (typeof tempData[field] === 'object') {
                    values.push(`'${JSON.stringify(tempData[field])}'`);
                }
                else if (typeof tempData[field] === 'number') {
                    values.push(tempData[field]);
                }
                else if (typeof tempData[field] === 'string') {
                    values.push(`'${tempData[field].replace(/'/g, '\'\'')}'`);
                }
            }
            sqlValues.push(`( ${values.join(',')} )`);
        }
        const fields = this.column.join(',') === '*' ? '' : `(${this.column.join(',')})`;
        const insertSql = `insert into "${this.tableName}" ${fields} values ${sqlValues.join(',')}`;
        await this.db.query(insertSql).catch(err => {
            throw err;
        });
        return true;
    }
}
exports.default = PostgresWriter;
//# sourceMappingURL=postgreswriter.js.map