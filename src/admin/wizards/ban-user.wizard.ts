import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { ValidateAnswerPipe } from 'src/common/pipes/validate-answer.pipe';
import { MainWizardContext } from 'src/common/types';
import { User } from 'src/register/user.schema';
import { Markup } from 'telegraf';
import { ADMIN_SCENE } from '../admin.scene';
import { userToText } from '../admin.utils';

export interface BanUserWizardContext extends MainWizardContext {
  wizard: {
    state: {
      user: User;
    } & MainWizardContext['wizard']['state'];
  } & MainWizardContext['wizard'];
}

// TODO remove Questionnaire when banned

export const BAN_USER_WIZARD = 'BAN_USER_WIZARD';

@Wizard(BAN_USER_WIZARD)
export class BanUserWizard {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  @WizardStep(1)
  async step1(@Ctx() ctx: BanUserWizardContext) {
    await ctx.reply('Уведіть телеграм-айді користувача');
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(
    @Message('text') telegramId: string,
    @Ctx() ctx: BanUserWizardContext,
  ) {
    const user = await this.userModel.findOne({ telegramId });
    if (!user) {
      await ctx.reply('Користувача не знайдено :(');
      return ctx.scene.enter(ADMIN_SCENE);
    }
    ctx.wizard.state.user = user;
    await ctx.reply(userToText(user));
    await ctx.reply(
      'Забанити користувача?',
      Markup.keyboard(
        [Markup.button.text('Так 👹'), Markup.button.text('Ні ✨')],
        { columns: 2 },
      ).resize(true),
    );
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(
    @Message(
      new ValidateAnswerPipe({
        errorMessage: 'Обери надані варіанти',
        validAnswers: ['Так 👹', 'Ні ✨'],
      }),
    )
    conclusion: string,
    @Ctx() ctx: BanUserWizardContext,
  ) {
    if (conclusion === 'Ні ✨') {
      await ctx.reply('А йому повезло 😰');
      return ctx.scene.enter(ADMIN_SCENE);
    }
    const userToBan = ctx.wizard.state.user;
    userToBan.isBanned = true;
    await this.userModel.updateOne(
      { telegramId: userToBan.telegramId },
      userToBan,
    );
    await ctx.reply(
      `Користувач ${userToBan.firstname} успішно зловив бананчик 🩸🤗🍌`,
    );
    ctx.scene.enter(ADMIN_SCENE);
  }
}
