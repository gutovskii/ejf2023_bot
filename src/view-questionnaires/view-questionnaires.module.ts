import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Questionnaire,
  QuestionnaireSchema,
} from 'src/upload-questionnaire/questionnaire.schema';
import { UploadQuestionnaireModule } from 'src/upload-questionnaire/upload-questionnaire.module';
import { ViewQuestionnairesScene } from './view-questionnaires.scene';

@Module({
  imports: [
    UploadQuestionnaireModule,
    MongooseModule.forFeature([
      { name: Questionnaire.name, schema: QuestionnaireSchema },
    ]),
  ],
  providers: [ViewQuestionnairesScene],
})
export class ViewQuestionnairesModule {}
