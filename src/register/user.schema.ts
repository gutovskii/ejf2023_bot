import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from './role.enum';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  telegramId: string;

  @Prop({ required: false })
  username: string;

  @Prop({ required: true })
  firstname: string;

  @Prop()
  lastname: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  course: string;

  @Prop({ required: true })
  almaMater: string;

  @Prop({ enum: Role, default: Role.ADMIN })
  role: Role;

  @Prop({ type: Boolean, default: false })
  isBanned: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
