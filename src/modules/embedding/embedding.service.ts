import { Injectable } from '@nestjs/common';
import { OpenAIEmbeddings } from '@langchain/openai';

@Injectable()
export class EmbeddingService {
    private readonly embedding = new OpenAIEmbeddings({
        model: 'text-embedding-3-large', // or 'text-embedding-3-large'
        apiKey: process.env.OPENAI_API_KEY,
    });

    async embedDocuments(docs: Array<{ text: string } | { pageContent: string }>) {
        // Normalize input to { text: string }
        const normalized = docs.map(doc => ({
            text: (doc as any).text ?? (doc as any).pageContent ?? ''
        }));

        const embeddings = await this.embedding.embedDocuments(normalized.map(c => c.text));
        return normalized.map((c, idx) => ({
            text: c.text,
            embedding: embeddings[idx]
        }));
    }

    async embedQuery(query: string) {
        return await this.embedding.embedQuery(query);
    }
}

