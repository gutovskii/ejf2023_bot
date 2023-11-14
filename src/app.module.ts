import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { AboutUsModule } from './about-us/about-us.module';
import { AdminModule } from './admin/admin.module';
import { AppUpdate } from './app.update';
import { AwsModule } from './aws/aws.module';
import { MainModule } from './main/main.module';
import { QuestCaseStudyModule } from './quest-case-study/quest-case-study.module';
import { RegisterModule } from './register/register.module';
import { User, UserSchema } from './register/user.schema';
import { TimetableModule } from './timetable/timetable.module';
import { UploadQuestionnaireModule } from './upload-questionnaire/upload-questionnaire.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { ViewQuestionnairesModule } from './view-questionnaires/view-questionnaires.module';
import { ZSUFundingModule } from './zsu-funding/zsu-funding.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        BOT_TOKEN: Joi.string().required(),
        MONGO_URI: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
      }),
    }),
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const options: TelegrafModuleOptions = {
          token: config.get<string>('BOT_TOKEN'),
          middlewares: [
            session({
              defaultSession: () => ({
                user: new User(),
              }),
            }),
          ],
        };
        return options;
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const options: MongooseModuleFactoryOptions = {
          uri: config.get<string>('MONGO_URI'),
        };
        return options;
      },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RegisterModule,
    MainModule,
    TimetableModule,
    AdminModule,
    VacanciesModule,
    UploadQuestionnaireModule,
    ViewQuestionnairesModule,
    QuestCaseStudyModule,
    ZSUFundingModule,
    AboutUsModule,
    AwsModule,
  ],
  providers: [AppUpdate],
})
export class AppModule {}
