import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { UnAuthorizedAdminPageException } from '../../auth/exception/UnAuthorized-Admin-Page.exception';

@Catch(UnAuthorizedAdminPageException)
export class UnauthorizedPageExceptionFilter
  implements ExceptionFilter<UnAuthorizedAdminPageException>
{
  catch(exception: UnAuthorizedAdminPageException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(403).redirect('/operate/login');
  }
}
