import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IngestionService } from './ingestion.service';

@Controller('api/v1/ingestion')
export class IngestionController {
    constructor(private readonly ingestionService: IngestionService) { }

    /**
    * Accepts PDF/DOCX/TXT upload or URL for ingestion.
    */
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file?: Express.Multer.File,
        @Body('url') url?: string,
    ) {
        if (!file && !url) {
            throw new Error('Either file or URL must be provided');
        }
        return this.ingestionService.processInput({ file, url });
    }
}
