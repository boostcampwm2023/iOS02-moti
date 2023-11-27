import { ExecutionContext, Injectable } from '@nestjs/common';
import { AccessTokenGuard } from './access-token.guard';
import { UserRole } from '../../users/domain/user-role';
import { User } from '../../users/domain/user.domain';
import { MotimateException } from '../../common/exception/motimate.excpetion';
import { ERROR_INFO } from '../../common/exception/error-code';

@Injectable()
export class AdminTokenGuard extends AccessTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!(await super.canActivate(context))) return false;
    if (!this.validateAdminUser(req.user))
      throw new MotimateException(ERROR_INFO.RESTRICT_ACEESS_TO_ADMIN);
    return true;
  }

  validateAdminUser(user: User): boolean {
    return user?.roles?.filter((r) => r === UserRole.ADMIN).length > 0;
  }
}
