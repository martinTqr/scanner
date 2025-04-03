// app.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentAiService } from './services/document-ai.service';
import { EditDocumentDto, GetDocumentDto } from './dto/document.dto';
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

  @Get(':id')
  async getDocument(@Param('id') id: number) {
    const document = await this._documentService.getDocumentById(id);
    return document;
  }

  @Get(':id/pdf')
  async getDocumentPdf(@Param('id') id: number, @Res() res) {
    const file = await this._documentService.getDocumentPdf(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="30-wtf.pdf"`);

    file.pipe(res);
  }

  @Patch('edit/:id')
  async editDocument(
    @Param('id') id: number,
    @Body() newData: EditDocumentDto,
  ): Promise<any> {
    return this._documentService.editDocument(id, newData);
  }

  @Post('process')
  @UseInterceptors(FilesInterceptor('files'))
  async processDocuments(@UploadedFiles() files: any[]): Promise<any> {
    return this._documentAiService.processDocuments(files);
  }
}
