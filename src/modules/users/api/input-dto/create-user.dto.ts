import { IsEmail, IsMongoId, IsString, Length } from 'class-validator';

export class CreateUserInputDto {
  @IsString()
  @Length(3, 10)
  login: string;

  @IsString()
  @Length(6, 20)
  password: string;

  @IsEmail()
  email: string;
}

export class IdInputDto {
  @IsMongoId()
  id: string;
}
