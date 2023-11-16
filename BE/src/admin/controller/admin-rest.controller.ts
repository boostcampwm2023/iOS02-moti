import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AdminService } from '../application/admin.service';
import { AccessTokenGuard } from '../../auth/guard/access-token.guard';
import { AdminRegister } from '../dto/admin-register';
import { AuthenticatedUser } from '../../auth/decorator/athenticated-user.decorator';
import { User } from '../../users/domain/user.domain';
import { AdminLogin } from '../dto/admin-login';
import { ApiData } from '../../common/api/api-data';
import { AdminToken } from '../dto/admin-token';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('/api/v1/admin')
@ApiTags('어드민 API')
export class AdminRestController {
  constructor(private readonly adminService: AdminService) {}

  @HttpCode(204)
  @Post('register')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '어드민 등록 요청 API',
    description: '어드민 등록 요청',
  })
  async registerAdmin(
    @Body() registerRequest: AdminRegister,
    @AuthenticatedUser() user: User,
  ) {
    await this.adminService.registerAdmin(registerRequest, user);

    return ApiData.success('요청 접수완료');
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: '어드민 로그인 API',
    description: 'email, password',
  })
  async loginAdmin(
    @Body() loginRequest: AdminLogin,
  ): Promise<ApiData<AdminToken>> {
    const adminToken = await this.adminService.loginAdmin(loginRequest);
    return ApiData.success(AdminToken.from(adminToken));
  }
}
