import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger';
import { MotimateExceptionFilter } from './common/filter/exception.filter';
import { UnexpectedExceptionFilter } from './common/filter/unexpected-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { validationPipeOptions } from './config/validation';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalFilters(
    new UnexpectedExceptionFilter(),
    new MotimateExceptionFilter(),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  swaggerConfig(app);
  await app.listen(3000);
}
bootstrap();
