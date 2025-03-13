import { Module } from '@nestjs/common';
import { DocumentServiceClient } from '@google-cloud/documentai/build/src/v1beta3';
import { DocumentAiController } from './document-ai.controller';
import { DocumentAiService } from './document-ai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DocumentItem } from './entities/document-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, DocumentItem])],
  controllers: [DocumentAiController],
  providers: [DocumentAiService, DocumentServiceClient],
})
export class DocumentAiModule {}
