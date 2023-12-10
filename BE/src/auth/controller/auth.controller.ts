import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AppleLoginRequest } from '../dto/apple-login-request.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiData } from '../../common/api/api-data';
import { AppleLoginResponse } from '../dto/apple-login-response.dto';
import { RefreshAuthRequestDto } from '../dto/refresh-auth-request.dto';
import { AccessTokenGuard } from '../guard/access-token.guard';
import { User } from '../../users/domain/user.domain';
import { AuthenticatedUser } from '../decorator/athenticated-user.decorator';
import { RefreshAuthResponseDto } from '../dto/refresh-auth-response.dto';
import { RevokeAppleAuthRequest } from '../dto/revoke-apple-auth-request.dto';
import { RevokeAppleAuthResponse } from '../dto/revoke-apple-auth-response.dto';

@Controller('/api/v1/auth')
@ApiTags('auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: '애플 로그인 API',
    description: 'identityToken을 요청 받고, public key로 검증한다.',
  })
  @ApiCreatedResponse({
    description: '유저를 생성한다.',
    type: AppleLoginResponse,
  })
  async login(@Body() appleLoginRequest: AppleLoginRequest) {
    const appleLoginResponse =
      await this.authService.appleLogin(appleLoginRequest);
    return ApiData.success(appleLoginResponse);
  }

  @Post('refresh')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: 'refresh API',
    description: 'refreshToken을 통해 accessToken을 재발급한다.',
  })
  @ApiResponse({
    status: 200,
    description: '새로운 accessToken과 유저정보',
    type: RefreshAuthResponseDto,
  })
  @ApiBearerAuth('accessToken')
  async refresh(
    @AuthenticatedUser() user: User,
    @Body() refreshAuthRequestDto: RefreshAuthRequestDto,
  ) {
    const refreshAuthResponse = await this.authService.refresh(
      user,
      refreshAuthRequestDto,
    );
    return ApiData.success(refreshAuthResponse);
  }

  @Delete('revoke')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '회원탈퇴 API',
    description: 'refreshToken을 통해 accessToken을 재발급한다.',
  })
  @ApiResponse({
    status: 200,
    description: '회원 탈퇴',
    type: RevokeAppleAuthResponse,
  })
  @ApiBearerAuth('accessToken')
  async deactivateUser(
    @AuthenticatedUser() user: User,
    @Body() revokeAuthRequest: RevokeAppleAuthRequest,
  ) {
    const revokeAuthResponse = await this.authService.revoke(
      user,
      revokeAuthRequest,
    );
    return ApiData.success(revokeAuthResponse);
  }
}
