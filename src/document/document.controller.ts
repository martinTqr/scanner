// app.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentAiService } from './services/document-ai.service';
import { GetDocumentDto } from './dto/document.dto';
import { DocumentService } from './services/document.service';

@Controller('documents')
export class DocumentAiController {
  constructor(
    private readonly _documentAiService: DocumentAiService,
    private readonly _documentService: DocumentService,
  ) {}

  @Get('')
  async getDocuments(@Query() queryParams: GetDocumentDto): Promise<any> {
    return this._documentService.getDocuments(queryParams);
  }

  @Get(':id/pdf')
  async getDocumentPdf(@Param('id') id: number, @Res() res) {
    const file = await this._documentService.getDocumentPdf(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="30-wtf.pdf"`);

    file.pipe(res);
  }

  @Post('process')
  @UseInterceptors(FilesInterceptor('files'))
  async processDocuments(@UploadedFiles() files: any[]): Promise<any> {
    return this._documentAiService.processDocuments(files);
  }
}
