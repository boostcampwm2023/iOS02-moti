import {
  Controller,
  Delete,
  Get,
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
import { RejectUserListResponse } from '../dto/reject-user-list-response.dto';
import { AllowUserResponse } from '../dto/allow-user-response.dto';

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
  async reject(
    @AuthenticatedUser() user: User,
    @Param('userCode') userCode: string,
  ) {
    return ApiData.success(await this.userService.reject(user, userCode));
  }

  @ApiOperation({
    summary: '유저 차단 해제 API',
    description: '유저 차단을 해제한다.',
  })
  @ApiResponse({
    description: '유저 차단 해제',
    type: AllowUserResponse,
  })
  @ApiBearerAuth('accessToken')
  @Delete('/:userCode/reject')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async allow(
    @AuthenticatedUser() user: User,
    @Param('userCode') userCode: string,
  ) {
    return ApiData.success(await this.userService.allow(user, userCode));
  }

  @ApiOperation({
    summary: '차단 유저 목록 API',
    description: '차단한 유저를 조회한다.',
  })
  @ApiResponse({
    description: '차단 유저 목록',
    type: RejectUserListResponse,
  })
  @ApiBearerAuth('accessToken')
  @Get('/reject')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async rejectUserList(@AuthenticatedUser() user: User) {
    return ApiData.success(await this.userService.getRejectUserList(user));
  }
}
