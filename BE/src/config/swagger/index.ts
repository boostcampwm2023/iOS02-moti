import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const swaggerConfig = (app: INestApplication) => {
  const configService = app.get<ConfigService>(ConfigService);

  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('SWAGGER_TITLE'))
    .setDescription(configService.get<string>('SWAGGER_DESCRIPTION'))
    .setVersion(configService.get<string>('SWAGGER_VERSION'))
    .addTag(configService.get<string>('SWAGGER_TAG'))
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'accessToken',
        description: 'motimate access token (jwt)',
        in: 'header',
      },
      'accessToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
