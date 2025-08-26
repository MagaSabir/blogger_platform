import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  private LOGIN = 'admin';
  private PASSWORD = 'qwerty';
  constructor() {
    super();
  }

  validate(username: string, password: string) {
    if (username === this.LOGIN && password === this.PASSWORD) {
      return { username };
    }
    throw new UnauthorizedException();
  }
}
