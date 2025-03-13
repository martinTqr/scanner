import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USERNAME,
} from './config/constants';
import { DocumentAiModule } from './document-ai/document-ai.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log(
          'MIGRATIONS',
          path.join(__dirname, '/migrations/*{.ts,.js}'),
        );
        console.log('Entities', __dirname + './**/**/*entity{.ts,.js}');
        return {
          type: 'mysql',
          host: config.get<string>(DATABASE_HOST),
          username: config.get<string>(DATABASE_USERNAME),
          password: config.get<string>(DATABASE_PASSWORD),
          database: config.get<string>(DATABASE_NAME),
          port: parseInt(config.get<string>(DATABASE_PORT), 10),
          autoLoadEntities: true,
          migrations: [path.join(__dirname, '/migrations/*{.ts,.js}')],
          migrationsRun: true,
          synchronize: false,
        };
      },
    }),
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
