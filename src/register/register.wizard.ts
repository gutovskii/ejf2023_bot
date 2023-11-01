import { UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Hears, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { MAIN_SCENE } from 'src/main/main.scene';
import { InvalidAnswerFilter } from '../common/filters/invalid-answer.filter';
import { ValidateAnswerPipe } from '../common/pipes/validate-answer.pipe';
import { wizardReply, wizardStepBack } from '../common/utils';
import { RegisterWizardContext, registerWizardQuiz } from './register.config';
import { User } from './user.schema';

export const REGISTER_WIZARD = 'REGISTER_WIZARD';

@Wizard(REGISTER_WIZARD)
@UseFilters(InvalidAnswerFilter)
export class RegisterWizard {
  constructor(
    @InjectModel(User.name) private readonly studentModel: Model<User>,
  ) {}

  @WizardStep(1)
  async step1(@Ctx() ctx: RegisterWizardContext) {
    await ctx.reply('Бачу ти не зареєстрований... Давай це виправимо!');
    await ctx.reply(registerWizardQuiz[1].question);
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: registerWizardQuiz[1].errorMessage,
        validationSchema: registerWizardQuiz[1].validationSchema,
      }),
    )
    text: string,
    @Ctx() ctx: RegisterWizardContext,
  ) {
    ctx.wizard.state.name = text;
    await wizardReply(ctx, registerWizardQuiz, 2);
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: registerWizardQuiz[2].errorMessage,
        validAnswers: registerWizardQuiz[2].validAnswers,
      }),
    )
    text: string,
    @Ctx() ctx: RegisterWizardContext,
  ) {
    ctx.wizard.state.course = text;
    await wizardReply(ctx, registerWizardQuiz, 3);
    ctx.wizard.next();
  }

  @WizardStep(4)
  async step4(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: registerWizardQuiz[3].errorMessage,
        validationSchema: registerWizardQuiz[3].validationSchema,
        possibleAnswers: registerWizardQuiz[3].possibleAnswers,
      }),
    )
    text: string,
    @Ctx() ctx: RegisterWizardContext,
  ) {
    ctx.wizard.state.almaMater = text;
    await wizardReply(ctx, registerWizardQuiz, 4, {
      isNavBtns: false,
    });
    ctx.wizard.next();
  }

  @WizardStep(5)
  async step5(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: registerWizardQuiz[4].errorMessage,
        validAnswers: ['Так 😎'],
      }),
    )
    _: string,
    @Ctx() ctx: RegisterWizardContext,
  ) {
    const newUser = await this.studentModel.create({
      telegramId: ctx.from.id.toString(),
      username: ctx.from?.username,
      firstname: ctx.from.first_name,
      lastname: ctx.from?.last_name,
      name: ctx.wizard.state.name,
      course: ctx.wizard.state.course,
      almaMater: ctx.wizard.state.almaMater,
    });
    ctx.session.user = newUser;
    await ctx.reply(registerWizardQuiz[4].reply);
    await ctx.scene.enter(MAIN_SCENE);
  }

  @Hears('Повернутись')
  async goBack(@Ctx() ctx: RegisterWizardContext) {
    await wizardStepBack(ctx, registerWizardQuiz, []);
  }
}
