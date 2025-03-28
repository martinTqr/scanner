import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScannConfidenceService } from './scann-confidence.service';
import { ScannConfidence } from './entities/scann-confidence.entity';
import { ScannConfidenceController } from './scann-confidence.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ScannConfidence])],
  controllers: [ScannConfidenceController],
  providers: [ScannConfidenceService],
  exports: [ScannConfidenceService],
})
export class ScannConfidenceModule {}
