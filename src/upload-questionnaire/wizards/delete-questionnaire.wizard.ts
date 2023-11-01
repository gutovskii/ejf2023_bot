import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { AwsService } from 'src/aws/aws.service';
import { ValidateAnswerPipe } from 'src/common/pipes/validate-answer.pipe';
import { MainWizardContext } from 'src/common/types';
import { Markup } from 'telegraf';
import { Questionnaire } from '../questionnaire.schema';
import { UPLOAD_QUESTIONNAIRE_SCENE } from '../upload-questionnaire.scene';

export const DELETE_QUESTIONNAIRE_WIZARD = 'DELETE_QUESTIONNAIRE_WIZARD';

@Wizard(DELETE_QUESTIONNAIRE_WIZARD)
export class DeleteQuestionnaireWizard {
  constructor(
    @InjectModel(Questionnaire.name)
    private readonly questionnaireModel: Model<Questionnaire>,
    private readonly awsService: AwsService,
  ) {}

  @WizardStep(1)
  async step1(@Ctx() ctx: MainWizardContext) {
    await ctx.reply(
      'Ти точно впевнений? То прийдеться наново заповнювати 🤔',
      Markup.keyboard(
        [Markup.button.text('Так 👻'), Markup.button.text('Ні 😊')],
        { columns: 2 },
      ).resize(true),
    );
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: 'Обери надані варіанти',
        validAnswers: ['Так 👻', 'Ні 😊'],
      }),
    )
    decision: string,
    @Ctx() ctx: MainWizardContext,
  ) {
    if (decision === 'Ні 😊') {
      await ctx.reply('А ти був близько 😬');
      ctx.scene.enter(UPLOAD_QUESTIONNAIRE_SCENE);
      return;
    }
    try {
      const questionnaire: { key: string } = await this.questionnaireModel
        .findOne({
          user: ctx.session.user,
        })
        .select('key');
      await this.questionnaireModel.deleteOne({ user: ctx.session.user });
      await this.awsService.removeObject(questionnaire.key);
      await ctx.reply('Твоя анкета успішно видалена ✅');
    } catch (error) {
      await ctx.reply('Щось пішло не так, 😦 спробуй ще раз');
    }
    await ctx.scene.enter(UPLOAD_QUESTIONNAIRE_SCENE);
  }
}
