import { Module } from '@nestjs/common';
import { DocumentAiModule } from './document-ai/document-ai.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DocumentAiModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
