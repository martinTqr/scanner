// app.controller.ts
import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentAiService } from './document-ai.service';

@Controller('documents')
export class DocumentAiController {
  constructor(private readonly documentAiService: DocumentAiService) {}

  @Get()
  async getDocuments() {
    return this.documentAiService.getDocuments();
  }

  @Post('process')
  @UseInterceptors(FilesInterceptor('files'))
  async processDocuments(@UploadedFiles() files: any[]): Promise<any> {
    return this.documentAiService.processDocuments(files);
  }
}
