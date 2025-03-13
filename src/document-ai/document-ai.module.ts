import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentAiController } from './document-ai.controller';
import { DocumentAiService } from './document-ai.service';
import { DocumentItem } from './entities/document-item.entity';
import { Document } from './entities/document.entity';
import { DocumentItemService } from './document-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document, DocumentItem])],
  controllers: [DocumentAiController],
  providers: [DocumentAiService, DocumentItemService],
})
export class DocumentAiModule {}
