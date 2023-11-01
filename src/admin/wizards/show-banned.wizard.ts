import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ctx, Hears, Wizard, WizardStep } from 'nestjs-telegraf';
import { MainWizardContext } from 'src/common/types';
import { User } from 'src/register/user.schema';
import { Markup } from 'telegraf';
import { ADMIN_SCENE } from '../admin.scene';
import { userToText } from '../admin.utils';

export const SHOW_BANNED_WIZARD = 'SHOW_BANNED_WIZARD';

@Wizard(SHOW_BANNED_WIZARD)
export class ShowBannedWizard {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  @WizardStep(1)
  async step1(@Ctx() ctx: MainWizardContext) {
    await ctx.reply(
      'Оберіть дію',
      Markup.keyboard(
        [
          Markup.button.text('Список'),
          Markup.button.text('Кількість'),
          Markup.button.text('Назад'),
        ],
        { columns: 2 },
      ).resize(true),
    );
  }

  @Hears('Список')
  async list(@Ctx() ctx: MainWizardContext) {
    const bannedUsers = await this.userModel.find({ isBanned: true });
    if (!bannedUsers.length) {
      await ctx.reply('Ізолятор вільний 👻');
    } else {
      const usersStringified = bannedUsers
        .map((user) => userToText(user))
        .join('');
      await ctx.reply(usersStringified);
    }
    ctx.wizard.selectStep(1);
  }

  @Hears('Кількість')
  async count(@Ctx() ctx: MainWizardContext) {
    const bannedCount = await this.userModel.count({ isBanned: true });
    await ctx.reply(`Усього забанено: ${bannedCount}`);
    ctx.wizard.selectStep(1);
  }

  @Hears('Назад')
  goBack(@Ctx() ctx: MainWizardContext) {
    return ctx.scene.enter(ADMIN_SCENE);
  }
}
