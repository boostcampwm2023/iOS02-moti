import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { memoryStore } from 'cache-manager';

export const redisModuleOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return configService.get('NODE_ENV') === 'production'
      ? {
          store: redisStore,
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          ttl: configService.get('CACHE_TTL'),
        }
      : { store: memoryStore };
  },
};
