import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { googleCloudConfig } from '../../config/google-cloud.config';
import { DocumentService } from './document.service';
@Injectable()
export class DocumentAiService {
  private readonly client: DocumentProcessorServiceClient;
  private readonly nameApi: string;

  constructor(private readonly _documentService: DocumentService) {
    this.client = new DocumentProcessorServiceClient({
      keyFilename: googleCloudConfig.keyFilename,
    });
    this.nameApi = `projects/${googleCloudConfig.projectId}/locations/${googleCloudConfig.location}/processors/${googleCloudConfig.processorId}`;
  }

  async processDocuments(files: any[]) {
    const batchid = uuidv4();
    return Promise.all(
      files.map(async (file) => {
        const fields = await this.googleProcessDocument(file);
        const doc = await this._documentService.createNewDocument({
          fields,
          batchid,
          fileName: file.originalname,
        });
        this._documentService.savePdf(doc.id, file);
        return doc;
      }),
    );
  }

  async googleProcessDocument(file): Promise<any> {
    try {
      if (file.mimetype !== 'application/pdf')
        throw new BadRequestException('Solamente se aceptan pdfs');

      const encodedImage = file.buffer.toString('base64');
      const request = {
        name: this.nameApi,
        rawDocument: {
          content: encodedImage,
          mimeType: 'application/pdf',
        },
      };
      console.log('googleProcessDocument request');
      const [result] = await this.client.processDocument(request);

      const parseResult = result.document.entities.map(
        this._documentService.parseResult,
      );

      return parseResult;
    } catch (error) {
      console.error('Error --> googleProcessDocument:', error);
      throw error;
    }
  }
}
