import { HttpService } from '@nestjs/axios';
import { UseFilters, UsePipes } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IncomingMessage } from 'http';
import { Model } from 'mongoose';
import { Ctx, Hears, Wizard, WizardStep } from 'nestjs-telegraf';
import { firstValueFrom } from 'rxjs';
import { AwsService, FIVE_MB } from 'src/aws/aws.service';
import { InvalidAnswerFilter } from 'src/common/filters/invalid-answer.filter';
import { ValidateDocumentPipe } from 'src/common/pipes/validate-document.pipe';
import { MainWizardContext } from 'src/common/types';
import { Markup } from 'telegraf';
import { Document } from 'telegraf/typings/core/types/typegram';
import { CHANGE_CV_SCENE } from '../change-cv.scene';
import { Questionnaire } from 'src/upload-questionnaire/questionnaire.schema';
import { fillQuestionnaireWizardQuiz } from 'src/upload-questionnaire/configs/fill-questionnaire.config';

export const CHANGE_CV_FILE_WIZARD = 'CHANGE_CV_FILE_WIZARD';

@Wizard(CHANGE_CV_FILE_WIZARD)
@UseFilters(InvalidAnswerFilter)
export class ChangeCVFileWizard {
  constructor(
    @InjectModel(Questionnaire.name)
    private readonly questionnaireModel: Model<Questionnaire>,
    private readonly awsService: AwsService,
    private readonly httpService: HttpService,
  ) {}

  @WizardStep(1)
  async step1(@Ctx() ctx: MainWizardContext) {
    await ctx.reply(
      fillQuestionnaireWizardQuiz[6].question,
      Markup.keyboard([Markup.button.text('Назад')]).resize(true),
    );
    ctx.wizard.next();
  }

  @WizardStep(2)
  @UsePipes(
    new ValidateDocumentPipe({
      maxSizeInBytes: FIVE_MB,
      extname: 'pdf',
    }),
  )
  async step2(@Ctx() ctx: MainWizardContext) {
    const document = (ctx.update as any).message.document as Document;
    const fileId = document.file_id;
    await ctx.reply('💭', Markup.removeKeyboard());
    const fileUrl = await ctx.telegram.getFileLink(fileId);
    const fileStream = (
      await firstValueFrom(
        this.httpService.get(fileUrl.toString(), { responseType: 'stream' }),
      )
    ).data as IncomingMessage;

    const questionnaire = await this.questionnaireModel.findOne({
      user: ctx.session.user,
    });
    const newKey = await this.awsService.updateObject(
      questionnaire.key,
      fileStream,
    );
    await this.questionnaireModel.updateOne(
      { user: ctx.session.user },
      { key: newKey },
    );
    await ctx.reply('Резюме успішно оновлено ✅');
    ctx.scene.enter(CHANGE_CV_SCENE);
  }

  @Hears('Назад')
  async goBack(@Ctx() ctx: MainWizardContext) {
    ctx.scene.enter(CHANGE_CV_SCENE);
  }
}
