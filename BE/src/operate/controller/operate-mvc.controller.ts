import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('operate')
export class OperateMvcController {
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
  async getOperate(@Res() res: Response) {
    res.sendFile('index.html', { root: 'public' });
  }
}
