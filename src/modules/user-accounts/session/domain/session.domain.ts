import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { User } from '../../users/domain/users.domain';

@Schema()
export class Session {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  deviceId: string;

  @Prop({ type: String, required: true })
  userAgent: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: Number, required: true })
  lastActiveDate: number;

  @Prop({ type: Number, required: true })
  expiration: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.loadClass(Session);

export type SessionDocument = HydratedDocument<Session>;
export type SessionModelType = Model<SessionDocument> & typeof Session;
