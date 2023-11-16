import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('operate')
export class OperateMvcController {
  @Get()
  async getOperate(@Res() res: Response) {
    res.sendFile('index.html', { root: 'public' });
  }
}
