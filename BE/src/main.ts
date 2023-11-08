import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger';
import { MotimateExceptionFilter } from './common/filter/exception.filter';
import { UnexpectedExceptionFilter } from './common/filter/unexpected-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new MotimateExceptionFilter());
  app.useGlobalFilters(new UnexpectedExceptionFilter());

  swaggerConfig(app);
  await app.listen(3000);
}
bootstrap();
