// app.controller.ts
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentAiService } from './document-ai.service';

@Controller('documents')
export class DocumentAiController {
  constructor(private readonly documentAiService: DocumentAiService) {}

  @Get()
  async getDocuments() {
    return this.documentAiService.getDocuments();
  }

  @Post('process')
  @UseInterceptors(FileInterceptor('file'))
  async processDocument(@UploadedFile() file: any): Promise<any> {
    return this.documentAiService.processDocument(file);
  }
}
