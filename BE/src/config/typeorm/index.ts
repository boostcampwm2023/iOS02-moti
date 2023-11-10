import { ConfigModule, ConfigService } from '@nestjs/config';
import { CamelSnakeNameStrategy } from './camel-snake-name-strategy';

export const typeOrmModuleOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const option = {
      type: configService.get('DB'),
      host: configService.get('DB_HOST'),
      port: parseInt(configService.get('DB_PORT')),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      entities: [configService.get('DB_ENTITIES')],
      logging: true,
      synchronize: true,
      namingStrategy: new CamelSnakeNameStrategy(),
    };
    return option;
  },
};
