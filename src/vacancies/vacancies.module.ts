import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VacanciesScene } from './vacancies.scene';
import { Vacancy, VacancySchema } from './vacancy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vacancy.name, schema: VacancySchema }]),
  ],
  providers: [VacanciesScene],
})
export class VacanciesModule {}
