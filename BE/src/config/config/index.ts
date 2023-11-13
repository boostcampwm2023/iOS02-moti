import * as process from 'process';
export const configServiceModuleOptions = {
  isGlobal: true,
  envFilePath: `.${process.env.NODE_ENV}.env`,
};
