import { IsString, IsUUID, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim';

export class InputNewPasswordDto {
  @IsString()
  @Trim()
  @Length(6, 20)
  newPassword: string;
  @IsUUID()
  recoveryCode: string;
}
