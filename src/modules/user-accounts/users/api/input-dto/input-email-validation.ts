import { IsEmail } from 'class-validator';

export class InputEmailValidation {
  @IsEmail()
  email: string;
}
