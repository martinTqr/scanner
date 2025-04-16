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
import * as archiver from 'archiver';

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

  @Get('export/csv')
  async exportToCSV(@Query() queryParams: GetDocumentDto, @Res() res) {
    const csvData = await this._documentService.exportToCSV(queryParams);

    // Create a zip file containing all CSV files
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=documents-export.zip',
    );

    // Pipe the archive to the response
    archive.pipe(res);

    // Add CSV content to the archive
    archive.append(Buffer.from(csvData.documents), { name: 'documents.csv' });
    archive.append(Buffer.from(csvData.items), { name: 'document_items.csv' });
    archive.append(Buffer.from(csvData.taxes), { name: 'document_taxes.csv' });

    // Finalize the archive
    await archive.finalize();
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
