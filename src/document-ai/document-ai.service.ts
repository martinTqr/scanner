import { google } from '@google-cloud/documentai/build/protos/protos';
import {
  DocumentProcessorServiceClient,
  DocumentServiceClient,
} from '@google-cloud/documentai/build/src/v1beta3';
import { Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { googleCloudConfig } from '../config/google-cloud.config';

@Injectable()
export class DocumentAiService {
  private readonly client: DocumentProcessorServiceClient;
  private readonly storage: Storage;
  private readonly documentAiService: DocumentServiceClient;
  private readonly nameApi: string;

  constructor() {
    this.client = new DocumentProcessorServiceClient({
      keyFilename: googleCloudConfig.keyFilename,
    });
    this.storage = new Storage({
      keyFilename: googleCloudConfig.keyFilename,
    });
    this.nameApi = `projects/${googleCloudConfig.projectId}/locations/${googleCloudConfig.location}/processors/${googleCloudConfig.processorId}`;
    this.documentAiService = new DocumentServiceClient({
      keyFilename: googleCloudConfig.keyFilename,
    });
  }

  async processDocument(file): Promise<any> {
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
      const processorSchema = await this.getProcessorSchema();

      const parseResult = result.document.entities.map(this.parseResult);

      const processorFields = this.extractProcessorFields(
        processorSchema.documentSchema.entityTypes,
      );
      console.log(processorFields);
      // const items = parseResult.filter((res) => res.properties.length);
      // this.parseItemsFields(items);
      return { fields: processorFields, res: parseResult };
    } catch (error) {
      console.error('Error al procesar el documento:', error);
      throw error;
    }
  }

  // parseItemsFields(
  //   entities: Partial<google.cloud.documentai.v1beta3.Document.IEntity>[],
  //   processorFields: any,
  // ) {
  //   entities, processorFields;
  // }

  parseResult(data: google.cloud.documentai.v1beta3.Document.IEntity) {
    return {
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
      type: data.type,
      mentionText: data.mentionText,
      mentionId: data.mentionId,
      confidence: data.confidence,
      id: data.id,
      normalizedValue: data.normalizedValue,
    };
  }

  async getProcessorSchema(): Promise<google.cloud.documentai.v1beta3.IDatasetSchema> {
    try {
      const name = `${this.nameApi}/dataset/datasetSchema`;
      const [res] = await this.documentAiService.getDatasetSchema({
        name,
      });
      return res;
    } catch (error) {
      console.error('Error al obtener el esquema del procesador:', error);
      throw error;
    }
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
