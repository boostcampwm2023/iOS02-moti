import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ApiData } from '../api/api-data';

@Catch()
export class UnexpectedExceptionFilter implements ExceptionFilter {
  logger = new Logger(UnexpectedExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    this.logger.error(exception);

    response.status(500).json(ApiData.error('Internal Server Error'));
  }
}
