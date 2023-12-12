import { ConfigModule, ConfigService } from '@nestjs/config';
import { CamelSnakeNameStrategy } from './camel-snake-name-strategy';

export const typeOrmModuleOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const option = {
      type: configService.get('DB'),
      host: configService.get('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      entities: [configService.get('DB_ENTITIES')],
      logging: configService.get('DB_LOGGING'),
      dropSchema: configService.get('NODE_ENV') === 'test',
      synchronize: configService.get('DB_SYNC'),
      namingStrategy: new CamelSnakeNameStrategy(),
      extra: {
        connectionTimeout: 5000,
      },
    };
    return option;
  },
};
