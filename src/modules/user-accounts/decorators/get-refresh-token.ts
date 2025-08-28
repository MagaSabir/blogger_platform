import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const GetRefreshToken = createParamDecorator(
  (data: string, context: ExecutionContext): string => {
    const request: Request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token: string = request.cookies['refreshToken'];
    if (!token) throw new UnauthorizedException('Token not found');
    return token;
  },
);
