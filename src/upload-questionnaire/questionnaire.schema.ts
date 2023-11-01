import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/register/user.schema';

@Schema()
export class Questionnaire {
  @Prop()
  fullName: string;

  @Prop()
  technologies: string;

  @Prop()
  bio: string;

  @Prop()
  fileName: string;

  @Prop()
  extname: string;

  @Prop()
  position: string;

  @Prop()
  key: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user?: User;
}

export const QuestionnaireSchema = SchemaFactory.createForClass(Questionnaire);
