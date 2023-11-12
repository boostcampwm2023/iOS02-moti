import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger';
import { MotimateExceptionFilter } from './common/filter/exception.filter';
import { UnexpectedExceptionFilter } from './common/filter/unexpected-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { validationPipeOptions } from './config/validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalFilters(
    new UnexpectedExceptionFilter(),
    new MotimateExceptionFilter(),
  );

  swaggerConfig(app);
  await app.listen(3000);
}
bootstrap();
