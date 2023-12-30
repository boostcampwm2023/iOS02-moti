import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger';
import { MotimateExceptionFilter } from './common/filter/exception.filter';
import { UnexpectedExceptionFilter } from './common/filter/unexpected-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { validationPipeOptions } from './config/validation';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { UnauthorizedPageExceptionFilter } from './common/filter/unauthorized-page-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalFilters(
    new UnexpectedExceptionFilter(),
    new MotimateExceptionFilter(),
    new UnauthorizedPageExceptionFilter(),
  );

  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  swaggerConfig(app);
  await app.listen(3000);
}
bootstrap();
