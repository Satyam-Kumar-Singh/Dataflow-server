import { Injectable, Logger } from '@nestjs/common';
import { PgVectorRepository } from 'src/infrastructure/database/pgvector.repository';
import { DocumentLoaderUtil } from './utils/document-loader.util';
import { TextSplitterUtil } from './utils/splitter.util';
import { EmbeddingUtil } from './utils/embedding.util';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly pgVectorRepo: PgVectorRepository,
    private readonly loader: DocumentLoaderUtil,
    private readonly splitter: TextSplitterUtil,
    private readonly embedder: EmbeddingUtil
  ) {}

  async processInput({ file, url, tableName }: { file?: Express.Multer.File; url?: string; tableName: string }) {
    this.logger.log('Starting ingestion...');

    // 1. Load document(s)
    const docs = await this.loader.load(file, url);

    // 2. Split into chunks
    const chunks = this.splitter.split(docs);

    // 3. Generate embeddings
    const embeddedData = await this.embedder.embed(chunks);

    // 4. Create table if not exist
    await this.pgVectorRepo.createTable(tableName);

    // 5. Store embeddings in DB
    for (const item of embeddedData) {
      await this.pgVectorRepo.insertEmbedding(tableName, item.text, item.embedding, { source: file?.originalname || url });
    }

    this.logger.log(`✅ Ingestion completed for ${tableName}`);
    return { message: 'Ingestion completed', records: embeddedData.length };
  }
}
