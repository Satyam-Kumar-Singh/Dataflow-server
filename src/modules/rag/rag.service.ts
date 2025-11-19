import { Injectable, Logger } from '@nestjs/common';
import { EmbeddingService } from '../embedding/embedding.service';
import { PgVectorRepository } from 'src/infrastructure/database/pgvector.repository';

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(
    private readonly embedder: EmbeddingService,
    private readonly vectorRepo: PgVectorRepository,
  ) {}

  /**
   * Main RAG method
   */
  async query(question: string, k = 5) {
    this.logger.log('🔍 Running RAG query...');

    // 1️⃣ Embed the user query
    const queryEmbedding = await this.embedder.embedQuery(question);

    // 2️⃣ Search database
    const results = await this.vectorRepo.searchSimilar(queryEmbedding, k);

    return {
      question,
      matches: results,
    };
  }
}
