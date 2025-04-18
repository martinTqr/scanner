import { google } from '@google-cloud/documentai/build/protos/protos';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { NewDocumentDetails } from 'src/document-details/dto/document.details.dto';
import { DocumentDetails } from 'src/document-details/entities/document-details.entity';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { DocumentDetailsService } from '../../document-details/document-details.service';
import { DocumentItemService } from '../../document-item/document-item.service';
import { NewDocumentItem } from '../../document-item/dto/document-item.dto';
import {
  DocumentItem,
  EditItemByDocumentDto,
} from '../../document-item/entities/document-item.entity';
import { DocumentTaxService } from '../../document-tax/document-tax.service';
import { NewDocumentTax } from '../../document-tax/dto/document.tax.dto';
import {
  DocumentTax,
  EditTaxByDocument,
} from '../../document-tax/entities/document-tax.entity';
import { EditDocumentDto, GetDocumentDto } from '../dto/document.dto';
import { Document } from '../entities/document.entity';
import {
  DocumentType,
  ParsedDocument,
  ReceiptType,
} from '../intefaces/document-ai.interfaces';
import { ScannConfidenceService } from 'src/scann-confidence/scann-confidence.service';
import { parseWeirdNumber } from 'src/config/helpers/parseWeirdNumber';
@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private _documentRepository: Repository<Document>,
    private _documentItemService: DocumentItemService,
    private _documentTaxService: DocumentTaxService,
    private _scannConfidenceService: ScannConfidenceService,
    private _documentDetailsService: DocumentDetailsService,
  ) {}

  async getDocuments(queryParams: GetDocumentDto): Promise<Document[]> {
    const { startDate, endDate, batch, ...rest } = queryParams;
    const params = Object.keys(rest);
    const filters: FindOptionsWhere<Document> = params.reduce((acum, key) => {
      if (rest[key]) {
        acum[key] = rest[key];
      }
      return acum;
    }, {});
    if (batch) {
      filters.details = {
        batch,
      };
    }

    if (startDate || endDate) {
      filters.date = Between(startDate, endDate);
    }

    return (await this._documentRepository.findBy(filters)).sort(
      (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)),
    );
  }

  async getDocumentById(id): Promise<Document> {
    return this._documentRepository.findOneBy({ id });
  }

  async getDocumentPdf(id: number): Promise<fs.ReadStream> {
    try {
      const document = await this.getDocumentById(id);
      if (!document) {
        throw new BadRequestException('Documento no encontrado');
      }

      const filePath = path.join(
        process.cwd(),
        'uploads',
        `${document.id}-${document.details.fileName}`,
      );

      await fs.promises.access(filePath, fs.constants.F_OK);

      return fs.createReadStream(filePath);
    } catch (e) {
      console.error('Error al obtener el PDF:', e);
      throw new BadRequestException('Archivo no encontrado o error al leerlo');
    }
  }

  async createNewDocument(data: {
    fields: ParsedDocument[];
    batchid: string;
    fileName: string;
  }) {
    const { fields, batchid, fileName } = data;
    const document = this._documentRepository.create();

    this.formatFieldsValue(fields, document);
    const { items, taxes } = this.getItemsAndTaxes(fields);
    document.items = await this.createDocumentItems(items);
    document.taxes = await this.createDocumentTaxes(taxes);
    const confidence =
      await this._scannConfidenceService.calculateConfidence(document);
    document.details = await this._documentDetailsService.createDocumentDetail({
      fileName,
      batch: batchid,
      //TODO: Cambiar userId por el usuario logueado
      userId: '',
      confidence,
    });
    if (document) return await this._documentRepository.save(document);
  }

  async createDocumentDetails(
    details: NewDocumentDetails,
  ): Promise<DocumentDetails> {
    return await this._documentDetailsService.createDocumentDetail(details);
  }

  async createDocumentTaxes(taxes: ParsedDocument[]): Promise<DocumentTax[]> {
    const createdTaxes = [];
    for (const tax of taxes) {
      const documentTax = {};
      tax.properties.forEach(
        (property) => (documentTax[property.type] = this.getValue(property)),
      );
      const newDocumentTax = await this._documentTaxService.createTax(
        documentTax as NewDocumentTax,
      );
      createdTaxes.push(newDocumentTax);
    }
    return createdTaxes;
  }

  async createDocumentItems(items: ParsedDocument[]): Promise<DocumentItem[]> {
    const createdItems: DocumentItem[] = [];
    for (const item of items) {
      const documentItem = {};
      item.properties.forEach(
        (property) => (documentItem[property.type] = this.getValue(property)),
      );
      const newDocumentItem = await this._documentItemService.createItem(
        documentItem as NewDocumentItem,
      );
      console.log(newDocumentItem);
      createdItems.push(newDocumentItem);
    }
    return createdItems;
  }

  async editDocument(id: number, newData: EditDocumentDto): Promise<Document> {
    const document = await this.getDocumentById(id);
    if (newData.items) this.validItemsIds(document, newData.items);
    if (newData.taxes) this.validTaxesIds(document, newData.taxes);
    this._documentRepository.merge(document, newData);

    return this._documentRepository.save(document);
  }

  validItemsIds(document: Document, items: EditItemByDocumentDto[]) {
    const documentItemsIds = document.items.map((item) => item.id);
    const itemsIdsIncluded = items.every((item) =>
      documentItemsIds.includes(item.id),
    );
    if (!itemsIdsIncluded)
      throw new BadRequestException(
        'Los ids de los items no coinciden con los del documento',
      );
  }

  validTaxesIds(document: Document, taxes: EditTaxByDocument[]) {
    const documentTaxesIds = document.taxes.map((tax) => tax.id);
    const taxesIdsIncluded = taxes.every((tax) =>
      documentTaxesIds.includes(tax.id),
    );
    if (!taxesIdsIncluded)
      throw new BadRequestException(
        'Los ids de los impuestos no coinciden con los del documento',
      );
  }

  savePdf(documentId: number, file: any) {
    const base64 = file.buffer.toString('base64');
    const fileBuffer = Buffer.from(base64, 'base64'); // If base64 encoded
    const uploadDir = path.join(process.cwd(), 'uploads');
    const fileName = `${documentId}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    // Save the file
    fs.writeFileSync(filePath, fileBuffer);
  }

  calculateDocConfidence(fields: ParsedDocument[]) {
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

      //TODO: VER esto
      if (type === 'total' || type === 'caeNumber') {
        document[type] = parseFloat(String(document[type]).replace(/,/g, '.'));
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
    const floatValues = ['quantity', 'amount', 'unitPrice', 'total'];
    if (floatValues.includes(property.type)) {
      value = parseWeirdNumber(value);

      console.log(property.type, value);
    }
    if (property.type === 'description' && value.length > 255) {
      value = value.substring(0, 255);
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
