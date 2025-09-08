import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { UsersConfig } from '../../../config/users.config';
@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  constructor(private userConfigs: UsersConfig) {
    super();
  }

  validate(username: string, password: string) {
    console.log(this.userConfigs);
    if (
      username === this.userConfigs.login &&
      password === this.userConfigs.password
    ) {
      return { username };
    }
    throw new UnauthorizedException();
  }
}
