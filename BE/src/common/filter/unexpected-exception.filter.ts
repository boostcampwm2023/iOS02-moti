import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ApiData } from '../api/api-data';

@Catch()
export class UnexpectedExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(500).json(ApiData.error('Internal Server Error'));
  }
}
