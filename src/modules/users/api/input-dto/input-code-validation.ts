import { IsUUID } from 'class-validator';

export class InputCodeValidation {
  @IsUUID()
  code: string;
}
