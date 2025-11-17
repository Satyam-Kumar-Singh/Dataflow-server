import { Injectable } from '@nestjs/common';
import { OpenAIEmbeddings } from '@langchain/openai';

@Injectable()
export class EmbeddingUtil {
  private readonly embedding = new OpenAIEmbeddings({
    model: 'text-embedding-3-large', // or 'text-embedding-3-large'
    apiKey: process.env.OPENAI_API_KEY,
  });

  async embed(docs) {
    const texts = docs.map((d) => d.pageContent);
    const embeddings = await this.embedding.embedDocuments(texts);
    return texts.map((text, i) => ({ text, embedding: embeddings[i] }));
  }
}
