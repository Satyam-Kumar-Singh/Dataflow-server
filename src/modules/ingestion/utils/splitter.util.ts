import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from '@langchain/core/documents';

@Injectable()
export class TextSplitterUtil {
  async split(docs) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    return await splitter.splitDocuments(docs);
  }
}
