import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';

import { ErrorResponse } from '../../model/web.model';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      const errors: ErrorResponse[] = [];
      exception.errors.forEach((data) => {
        errors.push({ message: data.message, path: data.path });
      });
      response.status(400).json({
        errors: errors,
      });
    } else {
      response.status(500).json({
        errors: exception.message,
      });
    }
  }
}
