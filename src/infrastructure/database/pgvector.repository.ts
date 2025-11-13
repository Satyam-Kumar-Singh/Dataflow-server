import { Injectable, Logger } from "@nestjs/common";
import { PostgresClient } from "./postgres.client";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PgVectorRepository {
    private readonly logger = new Logger(PgVectorRepository.name);

    constructor(private readonly db: PostgresClient) { }

    async createTable(tableName: string) {
        const sqlFile = path.join(__dirname, 'sql/create_table.sql');
        let sql = fs.readFileSync(sqlFile, 'utf-8');
        sql = sql.replace(/knowledge/g, tableName);

        try {
            await this.db.query(sql);
            this.logger.log(`✅ Table "${tableName}" created successfully`);
        } catch (err) {
            this.logger.error(`❌ Failed to create table: ${err.message}`);
            throw err;
        }
    }

    async insertEmbedding(tableName: string, content: string, embedding: number[], metadata: any) {
        const sql = `
      INSERT INTO ${tableName} (content, embedding, metadata)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
        await this.db.query(sql, [content, embedding, metadata]);
    }
}