import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { MainWizardContext } from 'src/common/types';
import { User } from 'src/register/user.schema';
import { Markup } from 'telegraf';
import { ADMIN_SCENE } from '../admin.scene';
import { userToText } from '../admin.utils';

export const FIND_USER_WIZARD = 'FIND_USER_WIZARD';

@Wizard(FIND_USER_WIZARD)
export class FindUserWizard {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  @WizardStep(1)
  async step1(@Ctx() ctx: MainWizardContext) {
    await ctx.reply(
      "Уведіть ім'я (firstname) користувача",
      Markup.removeKeyboard(),
    );
    ctx.wizard.next();
  }

  @WizardStep(2)
  async step2(
    @Message('text') firstname: string,
    @Ctx() ctx: MainWizardContext,
  ) {
    const users = await this.userModel.find({
      firstname: { $regex: firstname, $options: 'i' },
    });
    if (!users.length) {
      await ctx.reply('Таких користувачів не знайдено :(');
      return ctx.scene.enter(ADMIN_SCENE);
    }
    const usersStringified = users.map((user) => userToText(user)).join('');
    await ctx.reply(usersStringified);
    return ctx.scene.enter(ADMIN_SCENE);
  }
}
