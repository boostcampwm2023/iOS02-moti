import { ConfigModule, ConfigService } from '@nestjs/config';
import { memoryStore } from 'cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CacheStore } from '@nestjs/cache-manager';
import { CacheManagerOptions } from '@nestjs/cache-manager/dist/interfaces/cache-manager.interface';

export const redisModuleOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<CacheManagerOptions> => {
    if (configService.get('NODE_ENV') === 'production') {
      const store = await redisStore({
        socket: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
        ttl: configService.get('CACHE_TTL'),
      });
      return {
        store: {
          create: () => store as unknown as CacheStore,
        },
      };
    }
    return { store: memoryStore, ttl: configService.get('CACHE_TTL') };
  },
};
