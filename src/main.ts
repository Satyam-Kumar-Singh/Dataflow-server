import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  //CORS setup
  app.enableCors({
    origin: configService.get<string>('corsOrigin') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  //Security middleware
  app.use(helmet());
  app.use(compression());

  //Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //Logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = configService.get<number>('port') ?? 9000;
  await app.listen(port);
  console.log(
    `🚀 Application running in ${configService.get<string>('nodeEnv')} mode on: http://localhost:${port}`,
  );
}
bootstrap();
