import { Body, Controller, Get, Post } from '@nestjs/common';
import { OperateService } from '../application/operate.service';
import { MotiPolicyResponse } from '../dto/moti-policy-response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MotiPolicyCreate } from '../dto/moti-policy-create';
import { ApiData } from '../../common/api/api-data';

@Controller('/api/v1/operate')
@ApiTags('운영 API')
export class OperateController {
  constructor(private readonly operateService: OperateService) {}

  @Post('policy')
  @ApiOperation({
    summary: '모티메이트 운영정책 초기화 API',
    description: '운영 정책은 1개만 등록 가능',
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
  async getPolicy(): Promise<ApiData<MotiPolicyResponse>> {
    const policy = await this.operateService.retrieveMotimateOperation();
    return ApiData.success(MotiPolicyResponse.from(policy));
  }
}
