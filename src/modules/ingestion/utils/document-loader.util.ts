import { Injectable } from '@nestjs/common';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DocumentLoaderUtil {
  async load(file?: Express.Multer.File, url?: string) {
    let loader;
    if (file) {
      const ext = path.extname(file.originalname).toLowerCase();
      const tempPath = `./uploads/${file.originalname}`;
      fs.writeFileSync(tempPath, file.buffer);

      switch (ext) {
        case '.pdf':
          loader = new PDFLoader(tempPath);
          break;
        case '.docx':
          loader = new DocxLoader(tempPath);
          break;
        case '.txt':
          loader = new TextLoader(tempPath);
          break;
        default:
          throw new Error('Unsupported file format');
      }
      return await loader.load();
    }

    if (url) {
      loader = new CheerioWebBaseLoader(url);
      return await loader.load();
    }

    throw new Error('No valid input provided');
  }
}
