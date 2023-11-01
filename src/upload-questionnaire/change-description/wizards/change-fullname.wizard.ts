import { UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Hears, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { InvalidAnswerFilter } from 'src/common/filters/invalid-answer.filter';
import { ValidateAnswerPipe } from 'src/common/pipes/validate-answer.pipe';
import { MainWizardContext } from 'src/common/types';
import { wizardReply } from 'src/common/utils';
import { CHANGE_DESCRIPTION_SCENE } from '../change-description.scene';
import { Questionnaire } from 'src/upload-questionnaire/questionnaire.schema';
import { fillQuestionnaireWizardQuiz } from 'src/upload-questionnaire/configs/fill-questionnaire.config';
import { questionnaireToText } from 'src/upload-questionnaire/upload-questionnaire.utils';

export const CHANGE_DESCRIPTION_FULLNAME_WIZARD =
  'CHANGE_DESCRIPTION_FULLNAME_WIZARD';

@Wizard(CHANGE_DESCRIPTION_FULLNAME_WIZARD)
@UseFilters(InvalidAnswerFilter)
export class ChangeDescriptionFullnameWizard {
  constructor(
    @InjectModel(Questionnaire.name)
    private readonly questionnaireModel: Model<Questionnaire>,
  ) {}

  @WizardStep(1)
  async step1(@Ctx() ctx: MainWizardContext) {
    const questionnaire = await this.questionnaireModel
      .findOne({
        user: ctx.session.user,
      })
      .select('fullName');
    await wizardReply(ctx, fillQuestionnaireWizardQuiz, 1, {
      isSendReply: false,
      isNavBtns: true,
      goToMenuBtnText: 'Назад',
    });
    await ctx.reply('А ось минулі дані');
    await ctx.reply(`${questionnaire.fullName}`);
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: fillQuestionnaireWizardQuiz[1].errorMessage,
        validationSchema: fillQuestionnaireWizardQuiz[1].validationSchema,
      }),
    )
    fullName: string,
    @Ctx() ctx: MainWizardContext,
  ) {
    await this.questionnaireModel.updateOne(
      { user: ctx.session.user },
      { fullName },
    );
    await ctx.reply('Дані успішно змінено ✅');
    const newCVInfo = await this.questionnaireModel.findOne({
      user: ctx.session.user,
    });
    await ctx.reply(questionnaireToText(newCVInfo));
    ctx.scene.enter(CHANGE_DESCRIPTION_SCENE);
  }

  @Hears('Назад')
  async goBack(@Ctx() ctx: MainWizardContext) {
    ctx.scene.enter(CHANGE_DESCRIPTION_SCENE);
  }
}
