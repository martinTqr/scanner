import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentTax } from './entities/document-tax.entity';
import { NewDocumentTax } from './dto/document.tax.dto';

@Injectable()
export class DocumentTaxService {
  constructor(
    @InjectRepository(DocumentTax)
    private _documentTaxRepository: Repository<DocumentTax>,
  ) {}

  async createDocumentTax(data: NewDocumentTax) {
    const documentTax = await this._documentTaxRepository.create(data);
    return await this._documentTaxRepository.save(documentTax);
  }
}
