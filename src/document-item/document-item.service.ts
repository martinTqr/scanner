import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentItem } from './entities/document-item.entity';
import { NewDocumentItem } from './dto/document-item.dto';

@Injectable()
export class DocumentItemService {
  constructor(
    @InjectRepository(DocumentItem)
    private _documentItemRepository: Repository<DocumentItem>,
  ) {}

  async createDocumentItem(data: NewDocumentItem) {
    const documentItem = this._documentItemRepository.create(data);
    return await this._documentItemRepository.save(documentItem);
  }
}
