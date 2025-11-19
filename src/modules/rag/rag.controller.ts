import { Controller, Post, Body } from '@nestjs/common';
import { RagService } from './rag.service';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('query')
  async query(@Body('question') question: string) {
    if (!question) {
      throw new Error('Question is required');
    }
    return this.ragService.query(question);
  }
}
