import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { validationSchema } from './config/validation';
import appConfig from './config/app.config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';
import { EmbeddingModule } from './modules/embedding/embedding.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [appConfig],
      validationSchema,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<ThrottlerModuleOptions> => ({
        throttlers: [
          {
            ttl: config.get<number>('RATE_LIMIT_TTL', 60),   // seconds
            limit: config.get<number>('RATE_LIMIT_MAX', 20), // requests per ttl
          },
        ],
      }),
    }),
    DatabaseModule,
    EmbeddingModule,
    IngestionModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // ✅ global guard
    },
  ],
})
export class AppModule {}
