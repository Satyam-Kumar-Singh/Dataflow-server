import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

@Injectable()
export class TextSplitterUtil {
  split(docs) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    return splitter.splitDocuments(docs);
  }
}
