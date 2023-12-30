import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminPageTokenGuard } from '../../auth/guard/admin-page-token.guard';
import { OperateService } from '../application/operate.service';
import { MotiPolicyIdempotentUpdate } from '../dto/moti-policy-idempotent-update';

@Controller('operate')
export class OperateMvcController {
  constructor(private readonly operateService: OperateService) {}

  @Get()
  @ApiOperation({
    summary: '모티 메이트 앱 배포 사이트',
    description: '모티 메이트 앱 배포 사이트',
  })
  @ApiResponse({
    status: 200,
    description: '모티 메이트 앱 배포 사이트',
    content: {
      'text/html': {},
    },
  })
  @UseGuards(AdminPageTokenGuard)
  async getOperatePage(@Res() res: Response) {
    return res.render('operate/retrieve', {
      head: '운영정책',
      key: ['latest', 'required', 'privacyPolicy'],
      content: [await this.operateService.retrieveMotimateOperation()],
    });
  }

  @Get('/update')
  @UseGuards(AdminPageTokenGuard)
  async updateOperatePage(@Res() res: Response) {
    return res.render('operate/update', {
      head: '운영정책',
      key: ['latest', 'required', 'privacyPolicy'],
      content: [await this.operateService.retrieveMotimateOperation()],
    });
  }

  @Post('/update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminPageTokenGuard)
  async updateOperate(
    @Res() res: Response,
    @Body() updatePolicyUpdate: MotiPolicyIdempotentUpdate,
  ) {
    return res.render('operate/retrieve', {
      head: '운영정책',
      key: ['latest', 'required', 'privacyPolicy'],
      content: [await this.operateService.updateMotiPolicy(updatePolicyUpdate)],
    });
  }

  @Get('/login')
  @Render('login')
  @ApiOperation({
    summary: '모티 메이트 앱 배포 사이트',
    description: '모티 메이트 앱 배포 사이트',
  })
  @ApiResponse({
    status: 200,
    description: '모티 메이트 앱 배포 사이트',
    content: {
      'text/html': {},
    },
  })
  async getAdminLogin() {}
}
