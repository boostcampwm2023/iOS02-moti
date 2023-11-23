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
    DB_LOGGING: Joi.boolean().required(),
    SWAGGER_TITLE: Joi.string().required(),
    SWAGGER_DESCRIPTION: Joi.string().required(),
    SWAGGER_VERSION: Joi.string().required(),
    SWAGGER_TAG: Joi.string().required(),
    APPLE_PUBLIC_KEY_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_VALIDITY: Joi.number().required(),
    REFRESH_JWT_SECRET: Joi.string().required(),
    REFRESH_JWT_VALIDITY: Joi.number().required(),
    BCRYPT_SALT: Joi.number().required(),
  }),
};
