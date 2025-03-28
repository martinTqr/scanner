// app.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { NewScannConfidence } from './dto/scann-confidence.item.dto';
import { ScannConfidenceService } from './scann-confidence.service';

@Controller('confidence')
export class ScannConfidenceController {
  constructor(
    private readonly _scannConfidenceService: ScannConfidenceService,
  ) {}

  @Get('')
  async getDocuments(): Promise<any> {
    return this._scannConfidenceService.getConfidenceFields();
  }

  @Post('')
  async createScannConfidence(
    @Body() fields: NewScannConfidence[],
  ): Promise<any> {
    return await this._scannConfidenceService.createScannConfidence(fields);
  }
}
