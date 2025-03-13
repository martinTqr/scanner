import { google } from '@google-cloud/documentai/build/protos/protos';
import { BadRequestException, Injectable } from '@nestjs/common';
import { googleCloudConfig } from '../config/google-cloud.config';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Repository } from 'typeorm';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { DocumentItemService } from './document-item.service';
import { NewDocumentItem } from './dto/document.item.dto';

@Injectable()
export class DocumentAiService {
  private readonly client: DocumentProcessorServiceClient;
  private readonly nameApi: string;

  constructor(
    @InjectRepository(Document)
    private _documentRepository: Repository<Document>,
    private _documentItemService: DocumentItemService,
  ) {
    this.client = new DocumentProcessorServiceClient({
      keyFilename: googleCloudConfig.keyFilename,
    });
    this.nameApi = `projects/${googleCloudConfig.projectId}/locations/${googleCloudConfig.location}/processors/${googleCloudConfig.processorId}`;
  }

  async getDocuments(): Promise<Document[]> {
    return await this._documentRepository.find();
  }

  async processDocument(file) {
    const fields = await this.googleProcessDocument(file);
    const document = await this.createNewDocument(fields);
    return document;
  }

  async googleProcessDocument(file): Promise<ParsedDocument[]> {
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
      const [result] = await this.client.processDocument(request);

      const parseResult = result.document.entities.map(this.parseResult);

      return parseResult;
    } catch (error) {
      console.error('Error al procesar el documento:', error);
      throw error;
    }
  }

  async createNewDocument(fields: ParsedDocument[]) {
    const document = this._documentRepository.create();
    fields.forEach(({ type, mentionText, normalizedValue }) => {
      document[type] = mentionText.replaceAll('\n', ' ');
      const normalizedValueFormat =
        normalizedValue as google.cloud.documentai.v1.Document.Entity.NormalizedValue;
      if (
        normalizedValueFormat &&
        normalizedValueFormat.structuredValue === 'dateValue'
      ) {
        document[type] = new Date(
          normalizedValueFormat.dateValue.year,
          normalizedValueFormat.dateValue.month,
          normalizedValueFormat.dateValue.day,
        );
      }
    });
    document.items = [];
    const items = fields.filter((field) => field.type === 'items');
    for (const item of items) {
      const documentItem = {};
      item.properties.forEach(
        (property) =>
          (documentItem[property.type] = property.mentionText.replaceAll(
            '\n',
            ' ',
          )),
      );
      console.log(documentItem);
      const newDocumentItem =
        await this._documentItemService.createDocumentItem(
          documentItem as NewDocumentItem,
        );
      console.log(newDocumentItem);
      document.items.push(newDocumentItem);
    }
    return await this._documentRepository.save(document);
  }

  parseResult(
    data: google.cloud.documentai.v1.Document.Entity,
  ): ParsedDocument {
    return {
      id: data.id,
      type: data.type,
      mentionText: data.mentionText,
      mentionId: data.mentionId,
      confidence: data.confidence,
      normalizedValue: data.normalizedValue,
      properties: data.properties.length
        ? data.properties.map((prop) => ({
            properties: [],
            type: prop.type,
            mentionText: prop.mentionText,
            mentionId: prop.mentionId,
            confidence: prop.confidence,
            id: prop.id,
            normalizedValue: prop.normalizedValue,
          }))
        : [],
    };
  }

  extractProcessorFields(
    entityTypes: google.cloud.documentai.v1beta3.DocumentSchema.IEntityType[],
  ) {
    const processorFields = [];

    const entityTypesMap = new Map();
    entityTypes.forEach((et) => {
      entityTypesMap.set(et.name, et);
    });

    function processProperties(
      properties: google.cloud.documentai.v1beta3.DocumentSchema.EntityType.IProperty[],
    ) {
      const fields = [];
      for (const prop of properties) {
        const name = prop.name;
        const type = prop.valueType;
        const childs = [];

        if (entityTypesMap.has(type)) {
          const childEntityType = entityTypesMap.get(type);
          childs.push(...processProperties(childEntityType.properties));
        }

        fields.push({ name, type, childs, value: null });
      }
      return fields;
    }

    const mainEntityType = entityTypes[0];
    processorFields.push(...processProperties(mainEntityType.properties));

    return processorFields;
  }
}

export interface ParsedDocument {
  id: string;
  type: string;
  mentionText: string;
  mentionId: string;
  confidence: number;
  normalizedValue: google.cloud.documentai.v1.Document.Entity.INormalizedValue;
  properties: ParsedDocument[];
}
