import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { ValidateAnswerPipe } from 'src/common/pipes/validate-answer.pipe';
import { MainWizardContext } from 'src/common/types';
import { User } from 'src/register/user.schema';
import { Markup } from 'telegraf';
import { ADMIN_SCENE } from '../admin.scene';
import { userToText } from '../admin.utils';

export interface UnbanUserWizardContext extends MainWizardContext {
  wizard: {
    state: {
      user: User;
    } & MainWizardContext['wizard']['state'];
  } & MainWizardContext['wizard'];
}

export const UNBAN_USER_WIZARD = 'UNBAN_USER_WIZARD';

@Wizard(UNBAN_USER_WIZARD)
export class UnbanUserWizard {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  @WizardStep(1)
  async step1(@Ctx() ctx: UnbanUserWizardContext) {
    await ctx.reply(
      'Уведіть телеграм-айді користувача',
      Markup.removeKeyboard(),
    );
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(
    @Message('text') telegramId: string,
    @Ctx() ctx: UnbanUserWizardContext,
  ) {
    const user = await this.userModel.findOne({ telegramId });
    if (!user) {
      await ctx.reply('Користувача не знайдено :(');
      return ctx.scene.enter(ADMIN_SCENE);
    }
    ctx.wizard.state.user = user;
    await ctx.reply(userToText(user));
    await ctx.reply(
      'Розбанити користувача?',
      Markup.keyboard(
        [Markup.button.text('Так ✨'), Markup.button.text('Ні 👹')],
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
        validAnswers: ['Так ✨', 'Ні 👹'],
      }),
    )
    conclusion: string,
    @Ctx() ctx: UnbanUserWizardContext,
  ) {
    if (conclusion === 'Ні 👹') {
      await ctx.reply('А він був так близько 😁');
      return ctx.scene.enter(ADMIN_SCENE);
    }
    const userToUnban = ctx.wizard.state.user;
    userToUnban.isBanned = false;
    await this.userModel.updateOne(
      { telegramId: userToUnban.telegramId },
      userToUnban,
    );
    await ctx.reply(`Користувач ${userToUnban.firstname} тепер на волі ✨🥰✨`);
    ctx.scene.enter(ADMIN_SCENE);
  }
}
