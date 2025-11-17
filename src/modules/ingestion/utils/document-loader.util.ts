import { Injectable } from '@nestjs/common';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text"
// import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DocumentLoaderUtil {
    async load(file?: Express.Multer.File, url?: string) {
        let loader;

        if (file) {
            const uploadsDir = path.join(process.cwd(), 'uploads');

            // ✅ Ensure uploads directory exists
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const filePath = path.join(uploadsDir, file.originalname);
            fs.writeFileSync(filePath, file.buffer); // ✅ Now this will work safely

            const ext = path.extname(file.originalname).toLowerCase();

            switch (ext) {
                case '.pdf':
                    loader = new PDFLoader(filePath);
                    break;
                case '.docx':
                    loader = new DocxLoader(filePath);
                    break;
                case '.txt':
                    loader = new TextLoader(filePath);
                    break;
                default:
                    throw new Error('Unsupported file format');
            }
            return await loader.load();
        }

        // if (url) {
        //   loader = new CheerioWebBaseLoader(url);
        //   return await loader.load();
        // }

        throw new Error('No valid input provided');
    }
}
