import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { google } from '@google-cloud/documentai/build/protos/protos';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { googleCloudConfig } from '../config/google-cloud.config';
import { DocumentItemService } from '../document-item/document-item.service';
import { NewDocumentItem } from '../document-item/dto/document.item.dto';
import { Document } from './entities/document.entity';
import { NewDocumentTax } from '../document-tax/dto/document.tax.dto';
import { DocumentTaxService } from '../document-tax/document-tax.service';

@Injectable()
export class DocumentAiService {
  private readonly client: DocumentProcessorServiceClient;
  private readonly nameApi: string;

  constructor(
    @InjectRepository(Document)
    private _documentRepository: Repository<Document>,
    private _documentItemService: DocumentItemService,
    private _documentTaxService: DocumentTaxService,
  ) {
    this.client = new DocumentProcessorServiceClient({
      keyFilename: googleCloudConfig.keyFilename,
    });
    this.nameApi = `projects/${googleCloudConfig.projectId}/locations/${googleCloudConfig.location}/processors/${googleCloudConfig.processorId}`;
  }

  async getDocuments(): Promise<Document[]> {
    return await this._documentRepository.find();
  }

  async processDocuments(files: any[]) {
    return Promise.all(
      files.map(async (file) => {
        const fields = await this.googleProcessDocument(file);
        const doc = await this.createNewDocument(fields);
        return doc;
      }),
    );
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
    const {
      items,
      taxes,
    }: { items: ParsedDocument[]; taxes: ParsedDocument[] } = fields.reduce(
      (acum, field) => {
        if (field.type === 'items' || field.type === 'taxes') {
          acum[field.type].push(field);
        }
        return acum;
      },
      { items: [], taxes: [] },
    );

    for (const item of items) {
      const documentItem = {};
      item.properties.forEach(
        (property) =>
          (documentItem[property.type] = this.normalizedValue(property)),
      );
      const newDocumentItem =
        await this._documentItemService.createDocumentItem(
          documentItem as NewDocumentItem,
        );
      document.items.push(newDocumentItem);
    }
    document.taxes = [];
    for (const tax of taxes) {
      const documentTax = {};
      tax.properties.forEach(
        (property) =>
          (documentTax[property.type] = this.normalizedValue(property)),
      );
      const newDocumentTax = await this._documentTaxService.createDocumentTax(
        documentTax as NewDocumentTax,
      );
      document.taxes.push(newDocumentTax);
    }
    return await this._documentRepository.save(document);
  }

  normalizedValue(property: ParsedDocument) {
    return (
      property.normalizedValue?.text ||
      property.mentionText.replaceAll('\n', ' ')
    );
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
