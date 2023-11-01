import { UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Hears, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { InvalidAnswerFilter } from 'src/common/filters/invalid-answer.filter';
import { ValidateAnswerPipe } from 'src/common/pipes/validate-answer.pipe';
import { MainWizardContext } from 'src/common/types';
import { wizardReply } from 'src/common/utils';
import { fillQuestionnaireWizardQuiz } from 'src/upload-questionnaire/configs/fill-questionnaire.config';
import { Questionnaire } from 'src/upload-questionnaire/questionnaire.schema';
import { questionnaireToText } from 'src/upload-questionnaire/upload-questionnaire.utils';
import { CHANGE_DESCRIPTION_SCENE } from '../change-description.scene';

export const CHANGE_DESCRIPTION_TECHNOLOGIES_WIZARD =
  'CHANGE_DESCRIPTION_TECHNOLOGIES_WIZARD';

@Wizard(CHANGE_DESCRIPTION_TECHNOLOGIES_WIZARD)
@UseFilters(InvalidAnswerFilter)
export class ChangeDescriptionTechnologiesWizard {
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
      .select('technologies');
    await wizardReply(ctx, fillQuestionnaireWizardQuiz, 3, {
      isSendReply: false,
      isNavBtns: true,
      goToMenuBtnText: 'Назад',
    });
    await ctx.reply('А ось минулі дані');
    await ctx.reply(`${questionnaire.technologies}`);
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: fillQuestionnaireWizardQuiz[3].errorMessage,
        validationSchema: fillQuestionnaireWizardQuiz[3].validationSchema,
      }),
    )
    technologies: string,
    @Ctx() ctx: MainWizardContext,
  ) {
    await this.questionnaireModel.updateOne(
      { user: ctx.session.user },
      { technologies },
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
