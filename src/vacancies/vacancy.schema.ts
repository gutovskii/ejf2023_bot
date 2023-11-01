import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Vacancy {
  @Prop()
  title: string;

  @Prop()
  link: string;

  @Prop()
  company: string;

  @Prop()
  description: string;

  @Prop()
  date: string;

  @Prop()
  cities: string;

  @Prop({ required: false })
  salary?: string;
}

export const VacancySchema = SchemaFactory.createForClass(Vacancy);
