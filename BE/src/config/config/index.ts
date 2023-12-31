import * as process from 'process';
import * as Joi from 'joi';

export const configServiceModuleOptions = {
  isGlobal: true,
  envFilePath: `.${process.env.NODE_ENV}.env`,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),

    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required().default(3306),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    DB_ENTITIES: Joi.string().required(),
    DB_LOGGING: Joi.boolean().default(false),
    DB_SYNC: Joi.boolean().default(false),

    SWAGGER_TITLE: Joi.string().required(),
    SWAGGER_DESCRIPTION: Joi.string().required(),
    SWAGGER_VERSION: Joi.string().required(),
    SWAGGER_TAG: Joi.string().required(),

    APPLE_PUBLIC_KEY_URL: Joi.string().required(),
    APPLE_TOKEN_URL: Joi.string().required(),
    APPLE_REVOKE_URL: Joi.string().required(),
    APPLE_CLIENT_ID: Joi.string().required(),
    APPLE_KEY_ID: Joi.string().required(),
    APPLE_TEAM_ID: Joi.string().required(),
    APPLE_AUD: Joi.string().required(),
    APPLE_PRIVATE_KEY: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_VALIDITY: Joi.number().required(),
    REFRESH_JWT_SECRET: Joi.string().required(),
    REFRESH_JWT_VALIDITY: Joi.number().required(),

    FILESTORE_PREFIX: Joi.string().required(),
    FILESTORE_IMAGE_PREFIX: Joi.string().required(),
    FILESTORE_THUMBNAIL_PREFIX: Joi.string().required(),

    NCP_REGION: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    NCP_ACCESS_KEY_ID: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    NCP_SECRET_ACCESS_KEY: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),

    GROUP_AVATAR_URLS: Joi.string().required(),
    USER_AVATAR_URLS: Joi.string().required(),

    REDIS_HOST: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),

    REDIS_PORT: Joi.number().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),

    CACHE_TTL: Joi.number().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  }),
};
