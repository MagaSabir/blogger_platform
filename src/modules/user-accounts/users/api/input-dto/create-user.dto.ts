import { IsEmail, IsMongoId, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim';

export class CreateUserInputDto {
  @IsString()
  @Trim()
  @Length(3, 10)
  login: string;

  @IsString()
  @Trim()
  @Length(6, 20)
  password: string;

  @Trim()
  @IsEmail()
  email: string;
}

export class IdInputDto {
  @IsMongoId()
  id: string;
}
