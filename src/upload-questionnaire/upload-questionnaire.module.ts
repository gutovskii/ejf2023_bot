import { S3 } from '@aws-sdk/client-s3';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsModule } from 'src/aws/aws.module';
import { User, UserSchema } from 'src/register/user.schema';
import { ChangeCVModule } from './change-cv/change-cv.module';
import { ChangeDescriptionModule } from './change-description/change-description.module';
import { Questionnaire, QuestionnaireSchema } from './questionnaire.schema';
import { UploadQuestionnaireScene } from './upload-questionnaire.scene';
import { UploadQuestionnaireService } from './upload-questionnaire.service';
import { DeleteQuestionnaireWizard } from './wizards/delete-questionnaire.wizard';
import { FillQuestionnaireWizard } from './wizards/fill-questionnaire.wizard';
import { ViewQuestionnaireWizard } from './wizards/view-questionnaire.wizard';

@Module({
  imports: [
    ChangeCVModule,
    ChangeDescriptionModule,
    MongooseModule.forFeature([
      { name: Questionnaire.name, schema: QuestionnaireSchema },
      { name: User.name, schema: UserSchema },
    ]),
    HttpModule.register({}),
    AwsModule,
  ],
  providers: [
    {
      provide: S3,
      useValue: new S3({}),
    },
    UploadQuestionnaireScene,
    FillQuestionnaireWizard,
    DeleteQuestionnaireWizard,
    ViewQuestionnaireWizard,
    UploadQuestionnaireService,
  ],
  exports: [UploadQuestionnaireService],
})
export class UploadQuestionnaireModule {}
