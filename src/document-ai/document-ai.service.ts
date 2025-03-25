import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { google } from '@google-cloud/documentai/build/protos/protos';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { googleCloudConfig } from '../config/google-cloud.config';
import { DocumentItemService } from '../document-item/document-item.service';
import { NewDocumentItem } from '../document-item/dto/document.item.dto';
import { DocumentItem } from '../document-item/entities/document-item.entity';
import { DocumentTaxService } from '../document-tax/document-tax.service';
import { NewDocumentTax } from '../document-tax/dto/document.tax.dto';
import { DocumentTax } from '../document-tax/entities/document-tax.entity';
import { GetDocumentDto } from './dto/document-ai.dto';
import { Document } from './entities/document.entity';
import {
  DocumentType,
  ParsedDocument,
  ReceiptType,
} from './intefaces/document-ai.interfaces';
import * as fs from 'fs';
import * as path from 'path';
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

  async getDocuments(queryParams: GetDocumentDto): Promise<Document[]> {
    const { startDate, endDate, ...rest } = queryParams;
    const params = Object.keys(rest);
    const filters: FindOptionsWhere<Document> = params.reduce((acum, key) => {
      if (rest[key]) {
        acum[key] = rest[key];
      }
      return acum;
    }, {});

    if (startDate || endDate) {
      filters.date = Between(startDate, endDate);
    }

    return (await this._documentRepository.findBy(filters)).sort(
      (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)),
    );
  }

  async processDocuments(files: any[]) {
    const batchid = uuidv4();
    return Promise.all(
      files.map(async (file) => {
        const fields = await this.googleProcessDocument(file);
        const doc = await this.createNewDocument({
          fields,
          batchid,
          fileName: file.originalname,
        });
        this.savePdf(doc.id, file);
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

      const parseResult = result.document.entities.map(this.parseResult);

      return parseResult;
    } catch (error) {
      console.error('Error --> googleProcessDocument:', error);
      throw error;
    }
  }

  async createNewDocument(data: {
    fields: ParsedDocument[];
    batchid: string;
    fileName: string;
  }) {
    const { fields, batchid, fileName } = data;
    const document = this._documentRepository.create();
    document.fileName = fileName;
    document.batch = batchid;
    this.formatFieldsValue(fields, document);
    const { items, taxes } = this.getItemsAndTaxes(fields);
    document.items = await this.createDocumentItems(items);
    document.taxes = await this.createDocumentTaxes(taxes);
    document.confidence = this.calculateDocConfidence(fields);
    return await this._documentRepository.save(document);
  }

  async createDocumentTaxes(taxes: ParsedDocument[]): Promise<DocumentTax[]> {
    const createdTaxes = [];
    for (const tax of taxes) {
      const documentTax = {};
      tax.properties.forEach(
        (property) => (documentTax[property.type] = this.getValue(property)),
      );
      const newDocumentTax = await this._documentTaxService.createDocumentTax(
        documentTax as NewDocumentTax,
      );
      createdTaxes.push(newDocumentTax);
    }
    return createdTaxes;
  }

  async createDocumentItems(items: ParsedDocument[]): Promise<DocumentItem[]> {
    const createdItems: DocumentItem[] = [];
    for (const item of items) {
      console.log(item);
      const documentItem = {};
      item.properties.forEach(
        (property) => (documentItem[property.type] = this.getValue(property)),
      );
      const newDocumentItem =
        await this._documentItemService.createDocumentItem(
          documentItem as NewDocumentItem,
        );
      createdItems.push(newDocumentItem);
    }
    return createdItems;
  }

  savePdf(documentId: number, file: any) {
    const base64 = file.buffer.toString('base64');
    const fileBuffer = Buffer.from(base64, 'base64'); // If base64 encoded
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${documentId}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    // Save the file
    fs.writeFileSync(filePath, fileBuffer);
  }

  calculateDocConfidence(fields: ParsedDocument[]) {
    console.log(fields);
    const confidence = fields.reduce(
      (acum, field) => (acum += field.confidence),
      0,
    );
    return confidence / fields.length;
  }

  getItemsAndTaxes(fields: ParsedDocument[]): {
    items: ParsedDocument[];
    taxes: ParsedDocument[];
  } {
    return fields.reduce(
      (acum, field) => {
        if (field.type === 'items' || field.type === 'taxes') {
          acum[field.type].push(field);
        }
        return acum;
      },
      { items: [], taxes: [] },
    );
  }

  formatFieldsValue(fields: ParsedDocument[], document: Document) {
    fields.forEach(({ type, mentionText, normalizedValue }) => {
      document[type] = mentionText.replaceAll('\n', ' ');
      const normalizedValueFormat =
        normalizedValue as google.cloud.documentai.v1.Document.Entity.NormalizedValue;
      if (type === 'receiptType') {
        document[type] = this.normalizeReceiptType(document[type]);
      }
      if (type === 'documentType') {
        document[type] = this.getDocumentType(document[type]);
      }
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
  }

  normalizeReceiptType(receiptType: string): ReceiptType {
    const cleanValue = receiptType.replace(/["'.]/g, '');
    if (cleanValue.length === 1) return ReceiptType[cleanValue];
    return null;
  }

  getDocumentType(text: string): DocumentType | null {
    // Normalizar el texto: convertir a mayúsculas y eliminar tildes
    const normalizedText = text
      .normalize('NFD') // Descompone caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
      .toUpperCase()
      .trim(); // Elimina espacios extras

    for (const documentType of Object.values(DocumentType)) {
      const enumWords = documentType.split(' ');

      const allWordsMatch = enumWords.every((enumWord) =>
        normalizedText.includes(enumWord),
      );

      if (allWordsMatch) {
        return documentType as DocumentType;
      }
    }
    return null;
  }

  getValue(property: ParsedDocument) {
    let value;
    value =
      property.normalizedValue?.text ||
      property.mentionText.replaceAll('\n', ' ');
    if (property.type === 'quantity' || property.type === 'amount') {
      value = parseFloat(value.replace(/,/g, '.'));
    }
    return value;
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
