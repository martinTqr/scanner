import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewDocumentItem } from './dto/document-item.dto';
import { DocumentItem } from './entities/document-item.entity';

@Injectable()
export class DocumentItemService {
  constructor(
    @InjectRepository(DocumentItem)
    private _documentItemRepository: Repository<DocumentItem>,
  ) {}

  async createItem(data: NewDocumentItem) {
    const documentItem = this._documentItemRepository.create(data);
    return await this._documentItemRepository.save(documentItem);
  }
}
