import { SetMetadata } from '@nestjs/common';

export const customRepository = Symbol('typeormCustomRepository');

export function CustomRepository(
  entity: new (...args: any[]) => any,
): ClassDecorator {
  return SetMetadata(customRepository, entity);
}
