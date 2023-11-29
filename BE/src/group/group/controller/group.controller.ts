import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GroupService } from '../application/group.service';
import { AccessTokenGuard } from '../../../auth/guard/access-token.guard';
import { AuthenticatedUser } from '../../../auth/decorator/athenticated-user.decorator';
import { GroupResponse } from '../dto/group-response.dto';
import { User } from '../../../users/domain/user.domain';
import { CreateGroupRequest } from '../dto/create-group-request.dto';
import { ApiData } from '../../../common/api/api-data';

@Controller('/api/v1/groups')
@ApiTags('그룹 API')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({
    summary: '그룹 생성 API',
    description: '그룹을를 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '그룹 생성',
    type: GroupResponse,
  })
  @ApiBearerAuth('accessToken')
  @Post()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  async createGroup(
    @Body() createGroupRequest: CreateGroupRequest,
    @AuthenticatedUser() user: User,
  ) {
    return ApiData.success(
      await this.groupService.create(user, createGroupRequest),
    );
  }
}
