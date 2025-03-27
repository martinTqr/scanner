import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewDocumentDetails } from './dto/document.details.dto';
import { DocumentDetails } from './entities/document-details.entity';

@Injectable()
export class DocumentDetailsService {
  constructor(
    @InjectRepository(DocumentDetails)
    private _documentDetailsRepository: Repository<DocumentDetails>,
  ) {}

  async createDocumentDetail(data: NewDocumentDetails) {
    const documentDetail = this._documentDetailsRepository.create(data);
    return await this._documentDetailsRepository.save(documentDetail);
  }
}
