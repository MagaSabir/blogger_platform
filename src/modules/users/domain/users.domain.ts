import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto/create-user.domain.dto';
import { HydratedDocument, Model } from 'mongoose';
import { add } from 'date-fns';
import { BadRequestException } from '@nestjs/common';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String })
  confirmationCode: string;

  @Prop({ type: Date })
  confirmationCodeExpiration: Date;

  @Prop({ type: String, required: true, default: false })
  isEmailConfirmed: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  static createUser(dto: CreateUserDto): UserDocument {
    const user = new this();
    user.login = dto.login;
    user.passwordHash = dto.passwordHash;
    user.email = dto.email;
    user.isEmailConfirmed = false;
    return user as UserDocument;
  }

  deleteUser(): void {
    if (this.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }

  setConfirmationCode(code: string) {
    this.confirmationCode = code;
    this.confirmationCodeExpiration = add(new Date(), {
      hours: 1,
      minutes: 30,
    });
  }

  confirmation(code: string) {
    if (code !== this.confirmationCode) {
      throw new BadRequestException('confirmation code is incorrect');
    }
    if (this.confirmationCodeExpiration < new Date()) {
      throw new BadRequestException('CodeExpiration');
    }

    this.isEmailConfirmed = true;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;
export type UserModelType = Model<UserDocument> & typeof User;
