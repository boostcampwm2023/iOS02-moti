import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { JwtUtils } from '../application/jwt-utils';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtUtils: JwtUtils,
    private readonly usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers['authorization'];
    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다!');
    }
    const splitToken = rawToken.split(' ');
    if (splitToken.length !== 2 || splitToken[0] != 'Bearer') {
      throw new UnauthorizedException('잘못된 요청입니다.');
    }
    this.jwtUtils.validateToken(splitToken[1]);
    const payloads = this.jwtUtils.parsePayloads(splitToken[1]);
    const userCode = payloads.userCode;

    req.user = await this.usersService.findOneByUserCode(userCode);

    return true;
  }
}
