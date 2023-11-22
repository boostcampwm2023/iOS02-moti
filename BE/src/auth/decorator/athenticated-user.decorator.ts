import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { InvalidTokenException } from '../exception/invalid-token.exception';

export const AuthenticatedUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) throw new InvalidTokenException();

    return user;
  },
);
