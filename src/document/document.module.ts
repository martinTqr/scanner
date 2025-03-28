import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentAiController } from './document.controller';
import { DocumentAiService } from './services/document-ai.service';
import { Document } from './entities/document.entity';
import { DocumentItemService } from '../document-item/document-item.service';
import { DocumentItem } from '../document-item/entities/document-item.entity';
import { DocumentTax } from '../document-tax/entities/document-tax.entity';
import { DocumentTaxService } from '../document-tax/document-tax.service';
import { DocumentDetailsService } from '../document-details/document-details.service';
import { DocumentDetails } from '../document-details/entities/document-details.entity';
import { DocumentService } from './services/document.service';
import { ScannConfidenceModule } from 'src/scann-confidence/scann-confidence.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Document,
      DocumentItem,
      DocumentTax,
      DocumentDetails,
    ]),
    ScannConfidenceModule,
  ],
  controllers: [DocumentAiController],
  providers: [
    DocumentService,
    DocumentAiService,
    DocumentItemService,
    DocumentTaxService,
    DocumentDetailsService,
  ],
})
export class DocumentModule {}
