import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MotimateException } from '../exception/motimate.excpetion';
import { Request, Response } from 'express';

@Catch(MotimateException)
export class MotimateExceptionFilter
  implements ExceptionFilter<MotimateException>
{
  catch(exception: MotimateException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.statusCode;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
