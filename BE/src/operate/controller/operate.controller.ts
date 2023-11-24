import { Body, Controller, Get, Patch, Post, Put } from '@nestjs/common';
import { OperateService } from '../application/operate.service';
import { MotiPolicyResponse } from '../dto/moti-policy-response';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MotiPolicyCreate } from '../dto/moti-policy-create';
import { ApiData } from '../../common/api/api-data';
import { MotiPolicyIdempotentUpdate } from '../dto/moti-policy-idempotent-update';
import { MotiPolicyPartialUpdate } from '../dto/moti-policy-partitial-update';

@Controller('/api/v1/operate')
@ApiTags('운영 API')
export class OperateController {
  constructor(private readonly operateService: OperateService) {}

  @Post('policy')
  @ApiOperation({
    summary: '모티메이트 운영정책 초기화 API',
    description: '운영 정책은 1개만 등록 가능',
  })
  @ApiResponse({
    description: '운영 정책',
    type: MotiPolicyResponse,
  })
  async initPolicy(
    @Body() initPolicy: MotiPolicyCreate,
  ): Promise<ApiData<MotiPolicyResponse>> {
    const policy = await this.operateService.initMotiPolicy(initPolicy);
    return ApiData.success(MotiPolicyResponse.from(policy));
  }

  @Get('policy')
  @ApiOperation({
    summary: '모티메이트 운영정책 조회 API',
    description: '모티메이트의 현재 버전, 최소 번전, 보안 정책을 조회',
  })
  @ApiResponse({
    description: '운영 정책',
    type: MotiPolicyResponse,
  })
  async getPolicy(): Promise<ApiData<MotiPolicyResponse>> {
    const policy = await this.operateService.retrieveMotimateOperation();
    return ApiData.success(MotiPolicyResponse.from(policy));
  }

  @Put('policy')
  @ApiOperation({
    summary: '모티메이트 운영정책 업데이트 API',
    description: '모티메이트의 현재 버전, 최소 번전, 보안 정책을 업데이트',
  })
  @ApiResponse({
    description: '운영 정책',
    type: MotiPolicyResponse,
  })
  async updateIdempotentPolicy(
    @Body() updatePolicyUpdate: MotiPolicyIdempotentUpdate,
  ): Promise<ApiData<MotiPolicyResponse>> {
    const policy =
      await this.operateService.updateMotiPolicy(updatePolicyUpdate);
    return ApiData.success(MotiPolicyResponse.from(policy));
  }

  @Patch('policy')
  @ApiOperation({
    summary: '모티메이트 운영정책 업데이트 API',
    description: '모티메이트의 현재 버전, 최소 번전, 보안 정책을 업데이트',
  })
  @ApiResponse({
    description: '운영 정책',
    type: MotiPolicyResponse,
  })
  async updatePartialPolicy(
    @Body() updatePolicyUpdate: MotiPolicyPartialUpdate,
  ): Promise<ApiData<MotiPolicyResponse>> {
    const policy =
      await this.operateService.updateMotiPolicy(updatePolicyUpdate);
    return ApiData.success(MotiPolicyResponse.from(policy));
  }
}
