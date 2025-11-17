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
    ) { }

    async processInput({ file, url }: { file?: Express.Multer.File; url?: string }) {
        this.logger.log('🚀 Ingestion started...');

        // 1️⃣ Load document
        const docs = await this.loader.load(file, url);
        this.logger.log(`Loaded ${docs.length} document(s)`);

        // 2️⃣ Split text into chunks
        const chunks = await this.splitter.split(docs);
        this.logger.log(`Split into ${chunks.length} chunks`);

        // 3️⃣ Generate embeddings
        const embeddedData = await this.embedder.embed(chunks);
        this.logger.log(`Generated ${embeddedData.length} embeddings`);

        // 4️⃣ Ensure table exists
        const tableName = 'knowledge'; // You can make this dynamic if needed
        // await this.pgVectorRepo.createTable(tableName);

        // 5️⃣ Store embeddings in DB
        for (const item of embeddedData) {
            await this.pgVectorRepo.insertEmbedding(
                tableName,
                item.text,
                item.embedding,
                {
                    source: file?.originalname || url || 'unknown',
                }
            );
        }

        // 6️⃣ Return preview
        return {
            message: '✅ Ingestion completed successfully',
            totalChunks: embeddedData.length,
            sample: embeddedData.slice(0, 2), // just preview
        };
    }
}
