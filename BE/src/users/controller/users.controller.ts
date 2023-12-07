import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiData } from '../../common/api/api-data';
import { AccessTokenGuard } from '../../auth/guard/access-token.guard';
import { AuthenticatedUser } from '../../auth/decorator/athenticated-user.decorator';
import { User } from '../domain/user.domain';
import { UsersService } from '../application/users.service';
import { RejectUserResponse } from '../dto/reject-user-response.dto';

@Controller('/api/v1/users')
@ApiTags('유저 API')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({
    summary: '특정 유저 차단 API',
    description: '특정 유저를 차단한다.',
  })
  @ApiResponse({
    description: '유저 차단',
    type: RejectUserResponse,
  })
  @ApiBearerAuth('accessToken')
  @Post('/:userCode/reject')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async users(
    @AuthenticatedUser() user: User,
    @Param('userCode') userCode: string,
  ) {
    return ApiData.success(await this.userService.reject(user, userCode));
  }
}
