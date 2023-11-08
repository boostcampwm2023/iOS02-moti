import { ConfigModule, ConfigService } from '@nestjs/config';

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
      entities: ['dist/**/*.entity{.ts,.js}'],
      logging: true,
      synchronize: true,
    };
    return option;
  },
};
