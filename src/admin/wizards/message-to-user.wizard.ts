import { UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { InvalidAnswerFilter } from 'src/common/filters/invalid-answer.filter';
import { MainWizardContext } from 'src/common/types';
import { User } from 'src/register/user.schema';
import { Markup } from 'telegraf';
import { ADMIN_SCENE } from '../admin.scene';
import { userToText } from '../admin.utils';

export interface MessageToUserWizardContext extends MainWizardContext {
  wizard: {
    state: {
      user: User;
    } & MainWizardContext['wizard']['state'];
  } & MainWizardContext['wizard'];
}

export const MESSAGE_TO_USER_WIZARD = 'MESSAGE_TO_USER_WIZARD';

@Wizard(MESSAGE_TO_USER_WIZARD)
@UseFilters(InvalidAnswerFilter)
export class MessageToUserWizard {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  @WizardStep(1)
  async step1(@Ctx() ctx: MessageToUserWizardContext) {
    await ctx.reply('Уведіть телеграм-айді користувача');
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(
    @Message('text') telegramId: string,
    @Ctx() ctx: MessageToUserWizardContext,
  ) {
    const user = await this.userModel.findOne({ telegramId });
    if (!user) {
      await ctx.reply('Користувача не знайдено :(');
      return ctx.scene.enter(ADMIN_SCENE);
    }
    ctx.wizard.state.user = user;
    await ctx.reply(userToText(user));
    await ctx.reply('Напиши повідомлення', Markup.removeKeyboard());
    ctx.wizard.next();
  }

  @WizardStep(3)
  async step3(
    @Message('text') message: string,
    @Ctx() ctx: MessageToUserWizardContext,
  ) {
    const telegramId = ctx.wizard.state.user.telegramId;
    await ctx.telegram.sendMessage(telegramId, message);
    await ctx.reply('Повідомлення надіслано ✅');
    ctx.scene.enter(ADMIN_SCENE);
  }
}
