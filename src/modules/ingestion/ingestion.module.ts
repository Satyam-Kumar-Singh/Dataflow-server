import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { DocumentLoaderUtil } from './utils/document-loader.util';
import { TextSplitterUtil } from './utils/splitter.util';
import { PgVectorRepository } from 'src/infrastructure/database/pgvector.repository';

@Module({
  controllers: [IngestionController],
  providers: [IngestionService, DocumentLoaderUtil, TextSplitterUtil, PgVectorRepository],
})
export class IngestionModule {}
