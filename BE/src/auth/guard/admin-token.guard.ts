import { ExecutionContext, Injectable } from '@nestjs/common';
import { AccessTokenGuard } from './access-token.guard';
import { UserRole } from '../../users/domain/user-role';
import { User } from '../../users/domain/user.domain';

@Injectable()
export class AdminTokenGuard extends AccessTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!(await super.canActivate(context))) return false;
    return this.validateAdminUser(req.user);
  }

  validateAdminUser(user: User): boolean {
    return user?.roles?.filter((r) => r === UserRole.ADMIN).length > 0;
  }
}
