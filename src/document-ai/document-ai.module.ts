import { Module } from '@nestjs/common';
import { DocumentServiceClient } from '@google-cloud/documentai/build/src/v1beta3';
import { DocumentAiController } from './document-ai.controller';
import { DocumentAiService } from './document-ai.service';

@Module({
  imports: [],
  controllers: [DocumentAiController],
  providers: [DocumentAiService, DocumentServiceClient],
})
export class DocumentAiModule {}
