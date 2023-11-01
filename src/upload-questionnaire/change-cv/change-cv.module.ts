import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsModule } from 'src/aws/aws.module';
import { Questionnaire, QuestionnaireSchema } from '../questionnaire.schema';
import { ChangeCVScene } from './change-cv.scene';
import { ChangeCVFileWizard } from './wizards/change-cv-file.wizard';
import { ChangeCVFilenameWizard } from './wizards/change-cv-filename.wizard';

@Module({
  providers: [ChangeCVScene, ChangeCVFilenameWizard, ChangeCVFileWizard],
  imports: [
    MongooseModule.forFeature([
      { name: Questionnaire.name, schema: QuestionnaireSchema },
    ]),
    HttpModule.register({}),
    AwsModule,
  ],
})
export class ChangeCVModule {}
