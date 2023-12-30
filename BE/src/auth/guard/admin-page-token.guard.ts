import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtUtils } from '../application/jwt-utils';
import { UsersService } from '../../users/application/users.service';
import { UnAuthorizedAdminPageException } from '../exception/UnAuthorized-Admin-Page.exception';

@Injectable()
export class AdminPageTokenGuard {
  constructor(
    private readonly jwtUtils: JwtUtils,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawToken = req.cookies['access-token'];
    if (!rawToken) throw new UnAuthorizedAdminPageException();

    try {
      this.jwtUtils.validateToken(rawToken);
    } catch (e) {
      throw new UnAuthorizedAdminPageException();
    }

    const payloads = this.jwtUtils.parsePayloads(rawToken);
    const userCode = payloads.userCode;
    req.user = await this.usersService.getUserByUserCodeWithRoles(userCode);
    return true;
  }
}
