// app.controller.ts
import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentAiService } from './document-ai.service';
import { GetDocumentDto } from './dto/document-ai.dto';

@Controller('documents')
export class DocumentAiController {
  constructor(private readonly documentAiService: DocumentAiService) {}

  @Get('')
  async getDocuments(@Query() queryParams: GetDocumentDto): Promise<any> {
    return this.documentAiService.getDocuments(queryParams);
  }

  @Post('process')
  @UseInterceptors(FilesInterceptor('files'))
  async processDocuments(@UploadedFiles() files: any[]): Promise<any> {
    return this.documentAiService.processDocuments(files);
  }
}
