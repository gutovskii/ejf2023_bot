import { UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Hears, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { AwsService } from 'src/aws/aws.service';
import { InvalidAnswerFilter } from 'src/common/filters/invalid-answer.filter';
import { ValidateAnswerPipe } from 'src/common/pipes/validate-answer.pipe';
import { MainWizardContext } from 'src/common/types';
import { wizardReply } from 'src/common/utils';
import { Markup } from 'telegraf';
import { CHANGE_CV_SCENE } from '../change-cv.scene';
import { Questionnaire } from 'src/upload-questionnaire/questionnaire.schema';
import { fillQuestionnaireWizardQuiz } from 'src/upload-questionnaire/configs/fill-questionnaire.config';

export const CHANGE_CV_FILENAME_WIZARD = 'CHANGE_CV_FILENAME_WIZARD';

@Wizard(CHANGE_CV_FILENAME_WIZARD)
@UseFilters(InvalidAnswerFilter)
export class ChangeCVFilenameWizard {
  constructor(
    @InjectModel(Questionnaire.name)
    private readonly questionnaireModel: Model<Questionnaire>,
    private readonly awsService: AwsService,
  ) {}

  @WizardStep(1)
  async step1(@Ctx() ctx: MainWizardContext) {
    const questionnaire = await this.questionnaireModel
      .findOne({
        user: ctx.session.user,
      })
      .select('fileName');
    await wizardReply(ctx, fillQuestionnaireWizardQuiz, 5, {
      isSendReply: false,
      isNavBtns: true,
      goToMenuBtnText: 'Назад',
    });
    await ctx.reply('А ось минулі дані');
    await ctx.reply(`${questionnaire.fileName}`);
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: fillQuestionnaireWizardQuiz[5].errorMessage,
        validationSchema: fillQuestionnaireWizardQuiz[5].validationSchema,
      }),
    )
    fileName: string,
    @Ctx() ctx: MainWizardContext,
  ) {
    await ctx.reply('💭', Markup.removeKeyboard());
    const CVToUpdate = await this.questionnaireModel
      .findOne({
        user: ctx.session.user,
      })
      .select('key');
    const newKey = await this.awsService.updateObjectKey(
      CVToUpdate.key,
      fileName,
    );
    await this.questionnaireModel.updateOne(
      { user: ctx.session.user },
      { fileName, key: newKey },
    );
    await ctx.reply('Дані успішно змінено ✅');
    ctx.scene.enter(CHANGE_CV_SCENE);
  }

  @Hears('Назад')
  async goBack(@Ctx() ctx: MainWizardContext) {
    ctx.scene.enter(CHANGE_CV_SCENE);
  }
}
