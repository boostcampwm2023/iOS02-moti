import {
  Body,
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
  ApiCreatedResponse,
  ApiOkResponse,
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
import { GroupListResponse } from '../dto/group-list-response';
import { ParseIntPipe } from '../../../common/pipe/parse-int.pipe';
import { GroupLeaveResponse } from '../dto/group-leave-response.dto';
import { InviteGroupRequest } from '../dto/invite-group-request.dto';
import { InviteGroupResponse } from '../dto/invite-group-response';
import { GroupUserListResponse } from '../dto/group-user-list-response';
import { AssignGradeRequest } from '../dto/assign-grade-request.dto';
import { AssignGradeResponse } from '../dto/assign-grade-response.dto';

@Controller('/api/v1/groups')
@ApiTags('그룹 API')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({
    summary: '그룹 생성 API',
    description: '그룹을 생성한다.',
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

  @ApiOperation({
    summary: '그룹 리스트 API',
    description: '유저가 속해 있는 그룹 리스트를 조회한다.',
  })
  @ApiOkResponse({
    description: '그룹 리스트',
    type: GroupListResponse,
  })
  @ApiBearerAuth('accessToken')
  @Get()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async getGroups(@AuthenticatedUser() user: User) {
    return ApiData.success(await this.groupService.getGroups(user.id));
  }

  @ApiOperation({
    summary: '그룹 탈퇴 API',
    description: '유저가 속해 있는 그룹에서 탈퇴한다.',
  })
  @ApiOkResponse({
    description: '그룹 탈퇴',
    type: GroupLeaveResponse,
  })
  @ApiBearerAuth('accessToken')
  @Delete(':groupId/participation')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async leaveGroup(
    @AuthenticatedUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return ApiData.success(
      await this.groupService.removeUser(user.id, groupId),
    );
  }

  @ApiOperation({
    summary: '그룹원 초대 API',
    description: '그룹에 사용자를 초대한다.',
  })
  @ApiOkResponse({
    description: '그룹원 초대',
    type: InviteGroupResponse,
  })
  @ApiBearerAuth('accessToken')
  @Post(':groupId/users')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async invite(
    @AuthenticatedUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() inviteGroupRequest: InviteGroupRequest,
  ) {
    return ApiData.success(
      await this.groupService.invite(user, groupId, inviteGroupRequest),
    );
  }

  @ApiOperation({
    summary: '그룹원 리스트 API',
    description: '그룹원 리스트를 조회한다.',
  })
  @ApiOkResponse({
    description: '그룹원 리스트',
    type: GroupUserListResponse,
  })
  @ApiBearerAuth('accessToken')
  @Get(':groupId/users')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async getGroupUsers(
    @AuthenticatedUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return ApiData.success(
      await this.groupService.getGroupUsers(user, groupId),
    );
  }

  @ApiOperation({
    summary: '그룹원 권한 수정 API',
    description: '그룹원의 권한을 수정한다.',
  })
  @ApiOkResponse({
    description: '그룹원 권한 수정',
    type: AssignGradeResponse,
  })
  @ApiBearerAuth('accessToken')
  @Post(':groupId/users/:userCode/auth')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async assignGrade(
    @AuthenticatedUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userCode') targetUserCode: string,
    @Body() inviteGroupRequest: AssignGradeRequest,
  ) {
    const assignGradeResponse = await this.groupService.updateGroupGrade(
      user,
      groupId,
      targetUserCode,
      inviteGroupRequest,
    );
    return ApiData.success(assignGradeResponse);
  }
}
