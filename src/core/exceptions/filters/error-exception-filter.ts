import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DomainExceptionCodes } from '../domain-exception-codes';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
  }

  private mapToHttpStatus(code: DomainExceptionCodes) {
    switch (code) {
      case DomainExceptionCodes.BadRequest:
      case DomainExceptionCodes.ConfirmationCodeExpired:
      case DomainExceptionCodes.PasswordRecoveryCodeExpired:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCodes.NotFound:
        return HttpStatus.NOT_FOUND;
      case DomainExceptionCodes.Unauthorized:
        return HttpStatus.UNAUTHORIZED;
    }
  }
}
