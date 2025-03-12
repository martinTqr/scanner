import { DocumentProcessorServiceClient } from '@google-cloud/documentai/build/src/v1';
import { Injectable } from '@nestjs/common';
import { promises } from 'fs';
import { googleCloudConfig } from '../config/google-cloud.config';

const client = new DocumentProcessorServiceClient({
  keyFilename: 'src/config/service-account.json',
});

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async quickstart() {
    try {
      // The full resource name of the processor, e.g.:
      // projects/project-id/locations/location/processor/processor-id
      // You must create new processors in the Cloud Console first
      const name = `projects/${googleCloudConfig.projectId}/locations/${googleCloudConfig.location}/processors/${googleCloudConfig.processorId}`;

      // Read the file into memory.
      const imageFile = await promises.readFile(googleCloudConfig.keyFilename);
      // Convert the image data to a Buffer and base64 encode it.
      const encodedImage = Buffer.from(imageFile).toString('base64');

      const request = {
        name,
        rawDocument: {
          content: encodedImage,
          mimeType: 'application/pdf',
        },
      };

      // Recognizes text entities in the PDF document
      const [result] = await client.processDocument(request);
      const { document } = result;

      // Get all of the document text as one big string
      const { text } = document;

      // Extract shards from the text field
      const getText = (textAnchor) => {
        if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
          return '';
        }

        // First shard in document doesn't have startIndex property
        const startIndex = textAnchor.textSegments[0].startIndex || 0;
        const endIndex = textAnchor.textSegments[0].endIndex;

        return text.substring(startIndex, endIndex);
      };

      // Read the text recognition output from the processor
      const [page1] = document.pages;
      const { paragraphs } = page1;

      for (const paragraph of paragraphs) {
        const paragraphText = getText(paragraph.layout.textAnchor);
        console.log(`Paragraph text:\n${paragraphText}`);
      }
    } catch (e) {
      console.log('error in quickstart ==>> ', e);
    }
  }
}
