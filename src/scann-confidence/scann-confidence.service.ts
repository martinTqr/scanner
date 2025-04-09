import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entities, ScannConfidence } from './entities/scann-confidence.entity';
import { NewScannConfidence } from './dto/scann-confidence.item.dto';
import { Document } from 'src/document/entities/document.entity';
import { DocumentTax } from 'src/document-tax/entities/document-tax.entity';
import { DocumentItem } from 'src/document-item/entities/document-item.entity';

@Injectable()
export class ScannConfidenceService {
  constructor(
    @InjectRepository(ScannConfidence)
    private _scannConfidenceRepository: Repository<ScannConfidence>,
  ) {}

  async getConfidenceFields(): Promise<ScannConfidence[]> {
    return await this._scannConfidenceRepository.find();
  }

  async createScannConfidence(
    data: NewScannConfidence[],
  ): Promise<ScannConfidence[]> {
    try {
      const documentItem = this._scannConfidenceRepository.create(data);
      return await this._scannConfidenceRepository.save(documentItem);
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async calculateConfidence(document: Document): Promise<number> {
    // Obtener todos los puntajes de la base de datos
    const { items, taxes, ...rest } = document;

    const documentData = {
      [Entities.DOCUMENT]: rest,
      [Entities.DOCUMENT_TAX]: taxes,
      [Entities.DOCUMNET_ITEM]: items,
    };

    const fieldScores = await this.getConfidenceFields();
    console.log(fieldScores);
    let obtainedScore = 0;
    const maxScorePossible = this.calculateTotalScore(
      documentData,
      fieldScores,
    );
    console.log(maxScorePossible);
    for (const field of fieldScores) {
      const score = this.getFieldValueScore(documentData, field);
      console.log(field, score);
      if (score) obtainedScore += score;
    }

    const confidence = (obtainedScore / maxScorePossible) * 100;

    return Math.round(confidence);
  }

  private calculateTotalScore(
    document: DocumentDataSplited,
    fieldScores: ScannConfidence[],
  ): number {
    const itemsLength = document[Entities.DOCUMNET_ITEM].length;
    const taxesLength = document[Entities.DOCUMENT_TAX].length;
    const total = fieldScores.reduce((acum, field) => {
      if (field.entity === Entities.DOCUMENT) acum += field.score;
      if (field.entity === Entities.DOCUMENT_TAX)
        acum += field.score * taxesLength;
      if (field.entity === Entities.DOCUMNET_ITEM)
        acum += field.score * itemsLength;

      return acum;
    }, 0);
    return total;
  }

  private getFieldValueScore(
    documentData: DocumentDataSplited,
    field: ScannConfidence,
  ): any {
    const value = documentData[field.entity];
    let score = field.score;
    if (Array.isArray(value) && value.length) {
      score = value.reduce((acum, item) => {
        if (item[field.field]) acum += field.score;
        return acum;
      }, 0);
      return score;
    }
    return value[field.field] ? score : 0;
  }
}

interface DocumentDataSplited {
  [Entities.DOCUMENT]: Partial<Document>;
  [Entities.DOCUMENT_TAX]: DocumentTax[];
  [Entities.DOCUMNET_ITEM]: DocumentItem[];
}
